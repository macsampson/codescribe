import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

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

interface IRequest {
  action: string;
  message: githubCodeResponse;
}

interface githubCodeResponse {
  code: string;
  fileName: string;
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (request) => {
    if (request.action === "fetchFromOpenAI") {
      // const { message } = request;
      console.log("fetch request received in background");
      try {
        const stream = await openAIFetch(
          request.message,
          request.model,
          request.detailLevel
        );
        console.log(request);
        for await (let data of stream) {
          port.postMessage({ text: data.choices[0]?.delta?.content });
        }

        port.postMessage({ endOfData: true });
      } catch (error) {
        console.error("Error fetching from OpenAI: ", error);
        port.postMessage({
          error: "An error occurred while processing the request.",
        });
      }
    }
  });
});

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
        content: `You are an expert programmer that can explain whatever code you are given. When referring to the code, refer to it as 'the code on this page'. You always answer with markdown formatting. You will be penalized if you do not answer with markdown when it would be possible. The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes. When referencing a specific piece of code, please include a markdown code block of the code.`,
      },
      {
        role: "user",
        content:
          `Please explain this code in a ${detailLevel} way. The file is called ${fileName}:\n\n` +
          code,
      },
    ],
    stream: true,
    // change max_tokens depending on detail level
    max_tokens: detailLevel === "concise" ? 500 : 1000,
    temperature: 0.9,
  });
}
