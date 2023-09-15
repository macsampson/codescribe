import React, { createContext, useContext, useState, useEffect } from "react";
import { Menu, Listbox } from "@headlessui/react";
import "@pages/panel/Panel.css";
// import CodeExplain from "@pages/content/components/CodeExplainerOutput/codeExplainerOutput";
// import * as marked from "marked";
import Options from "@pages/options/Options";
import History from "@pages/history/History";

import ChatHeader from "@src/pages/content/components/ChatHeader";
import ChatWindow from "@src/pages/content/components/ChatWindow";

import { ModelType, DetailLevelType, githubCodeResponse } from "@src/types";
import { modelOptions, detailOptions } from "@src/constants";

const CodeScribeContext = createContext(null);

export const useCodeScribeContext = () => useContext(CodeScribeContext);

enum View {
  CHAT,
  OPTIONS,
  HISTORY,
  // ... other views as needed in the future
}

const Panel: React.FC = () => {
  const [messages, setMessages] = useState([]);
  // create state for model and detail level
  const [model, setModel] = useState(modelOptions[0]);
  const [detailLevel, setDetailLevel] = useState(detailOptions[0]);
  // This state will determine which view is currently active
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [currentView, setCurrentView] = useState<View>(View.CHAT);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const showMainView = () => {
    setCurrentView(View.CHAT);
  };

  const handleStateChange = (
    model: ModelType,
    detailLevel: DetailLevelType
  ) => {
    setModel(model);
    setDetailLevel(detailLevel);
  };

  const handleButtonClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { action: "getCodeFromPage", url: tabs[0].url },
        function (response: githubCodeResponse) {
          if (chrome.runtime.lastError) {
            console.error("Error: ", chrome.runtime.lastError);
            return;
          }
          // if response.code or response.filename is "", then we are not on a github page
          if (response.code === "" || response.fileName === "") {
            console.error("Error: ", "Not on a GitHub page");
            // add message from codescribe saying not on a github page
            setMessages((prev) => [
              {
                sender: "CodeScribe",
                text: "No code found. Please navigate to a file with code.",
              },
              ...prev,
            ]);
            return;
          }
          // Add an empty chatgpt message to be populated in real-time
          setMessages((prev) => [
            {
              sender: "CodeScribe",
              text: "",
              model: model.value,
              url: response.url,
              detail: detailLevel,
            },
            ...prev,
          ]);
          const port = chrome.runtime.connect();
          port.postMessage({
            action: "fetchFromOpenAI",
            message: response,
            model: model.value,
            detail: detailLevel.value,
          });

          port.onMessage.addListener((response) => {
            // console.log("response received from background");

            // console.log("response", response);
            if (response.endOfData) {
              port.disconnect();
              return;
            }

            if (response.error) {
              console.error("Error: ", response.error);
              return;
            }

            // Update the message in real-time
            setMessages((prev) => {
              let updatedMessages = [...prev];
              if (updatedMessages[0].sender === "CodeScribe") {
                if (response.text) {
                  if (response.sender) {
                    updatedMessages[0].sender = response.sender;
                  }
                  updatedMessages[0].text += response.text;
                }
              }
              // console.log("updatedMessages", updatedMessages);
              return updatedMessages;
            });
          });
        }
      );
    });
  };

  const handleSendMessage = (message) => {
    setMessages([{ sender: "user", text: message }, ...messages]);
  };

  let renderedView;
  switch (currentView) {
    case View.OPTIONS:
      renderedView = <Options onGoBack={() => setCurrentView(View.CHAT)} />;
      break;
    case View.HISTORY:
      renderedView = <History onGoBack={() => setCurrentView(View.CHAT)} />;
      break;
    case View.CHAT:
    default:
      renderedView = (
        <>
          <ChatHeader
            onClick={handleButtonClick}
            onStateChange={handleStateChange}
            onOpenOptions={() => setCurrentView(View.OPTIONS)}
            onOpenHistory={() => setCurrentView(View.HISTORY)}
          />
          <ChatWindow messages={messages} />
          {/* <ChatInput onSendMessage={handleSendMessage} /> */}
        </>
      );
  }

  return (
    <CodeScribeContext.Provider value={{ messages, setMessages, showMainView }}>
      <div className="App flex flex-col h-screen">{renderedView}</div>
    </CodeScribeContext.Provider>
  );
};

export default Panel;
