import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { githubCodeResponse } from "@root/src/types";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

import OpenAI from "openai";

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */

let openai: OpenAI;
// openai = new OpenAI({
//   dangerouslyAllowBrowser: true,
// });

// Load api key from storage
chrome.storage.local.get(["openaiApiKey"]).then((result) => {
  // console.log('Value currently is ' + result.openaiApiKey);
  openai = new OpenAI({
    apiKey: result.openaiApiKey,
  });
});

// Listen for messages
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (key === "openaiApiKey") {
      openai = new OpenAI({ apiKey: newValue });
    }
  }
});

const GITHUB_URL = "https://github.com";

console.log("background loaded");
// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // console.log(url);
  // Enables the side panel on github.com
  if (url.origin === GITHUB_URL) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "src/pages/panel/index.html",
      enabled: true,
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      enabled: false,
    });
  }
});

const CACHE_KEY_PREFIX = "codeDescription_";

async function sha256(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Utility to generate a unique cache key based on the code's content
async function generateCacheKey(
  code: string,
  url: string,
  detail: string,
  model: string
): Promise<string> {
  return CACHE_KEY_PREFIX + (await sha256(code + url + detail + model));
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (request) => {
    if (request.action === "fetchFromOpenAI") {
      // const { message } = request;
      console.log("fetch request received in background");

      const cacheKey = await generateCacheKey(
        request.message.code,
        request.message.url,
        request.detail,
        request.model
      );

      // Check cache before making API call
      chrome.storage.local.get([cacheKey], async (items) => {
        if (items[cacheKey]) {
          console.log("cached description found");
          const cachedDescription = items[cacheKey];

          // Break the cached description into chunks
          const chunks = cachedDescription.split(" "); // Splitting by words for simplicity

          // Helper function to send each chunk with a delay
          function sendChunk(index: number) {
            if (index >= chunks.length) {
              port.postMessage({ endOfData: true });
              return;
            }
            port.postMessage({ text: chunks[index] + " " }); // Add a space after each word
            setTimeout(() => sendChunk(index + 1), 100); // 100ms delay between chunks
          }

          // Start sending chunks
          sendChunk(0);

          return;
        } else {
          try {
            const stream = await openAIFetch(
              request.message,
              request.model,
              request.detailLevel
            );
            console.log(request);
            let fullResponse = "";
            for await (let data of stream) {
              fullResponse += data.choices[0]?.delta?.content;
              port.postMessage({ text: data.choices[0]?.delta?.content });
            }

            // Store the full description to the storage
            chrome.storage.local.set({ [cacheKey]: fullResponse });

            port.postMessage({ endOfData: true });
          } catch (error) {
            console.error("Error fetching from OpenAI: ", error);
            port.postMessage({
              error: "An error occurred while processing the request.",
            });
          }
        }
      });
    }
  });
});

// Listener to navigate to source code of description
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "navigateToURL") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: navigateToURL,
          args: [message.url],
        });
      }
    });
  }
});

function navigateToURL(url: string) {
  window.location.href = url;
}

// function to call the OpenAI API and return a stream of explanations
function openAIFetch(
  message: githubCodeResponse,
  model: string,
  detailLevel: string
) {
  console.log("openAIFetch called");
  // create the messages array with the system and user messages
  const fileName = message.fileName;
  const code = message.code;

  // return a promise that resolves to a stream of explanations
  return openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: `You are an expert programming teacher. You will be given some code and you will explain what the code does. You will start with a high level summary and then break it down to the whatever detail level the user requests. You will respond with markdown. You will be penalized if you do not answer with markdown. The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes. You will only respond with the explanation. You will not ask the user if they have any questions or prompt the user to repond in any way. Please use at least one multiline code block in your response when referencing code.`,
      },
      {
        role: "user",
        content:
          `Here is a file called ${fileName}. Please give a ${detailLevel} description of the code. \n\n` +
          code,
      },
    ],
    stream: true,
    // change max_tokens depending on detail level
    max_tokens: detailLevel === "brief" ? 750 : 1200,
    temperature: 0.7,
  });
}
