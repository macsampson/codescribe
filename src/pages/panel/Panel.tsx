import React from "react";
import { Menu, Listbox } from "@headlessui/react";
import "@pages/panel/Panel.css";
// import CodeExplain from "@pages/content/components/CodeExplainerOutput/codeExplainerOutput";
import { useState, useEffect } from "react";
// import * as marked from "marked";
import Options from "@pages/options/Options";
import {
  Cog6ToothIcon,
  CodeBracketIcon,
  Bars2Icon,
  Bars4Icon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

const title = "CodeScribe for GitHub";
const modelSelectLabel = "Model Selection";
const detailSelectLabel = "Set Response Detail";
const explainCodeButtonLabel = "Explain Code";

interface githubCodeResponse {
  code: string;
  fileName: string;
}

type ModelType = {
  id: number;
  label: string;
  value: string;
};
type DetailLevelType = {
  id: number;
  label: string;
  value: string;
  icon: JSX.Element;
};

const detailOptions = [
  { id: 1, label: "Concise", value: "concise", icon: <Bars2Icon /> },
  { id: 2, label: "Detailed", value: "detailed", icon: <Bars4Icon /> },
  // Add other detail options as needed
];

const modelOptions = [
  { id: 1, label: "GPT-3.5", value: "gpt-3.5-turbo" },
  { id: 2, label: "GPT-4", value: "gpt-4" },
];

const Panel: React.FC = () => {
  const [messages, setMessages] = useState([]);
  // create state for model and detail level
  const [model, setModel] = useState(modelOptions[0]);
  const [detailLevel, setDetailLevel] = useState(detailOptions[0]);
  // This state will determine which view is currently active
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

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
        { action: "getCodeFromPage" },
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
          setMessages((prev) => [{ sender: "CodeScribe", text: "" }, ...prev]);
          const port = chrome.runtime.connect();
          port.postMessage({
            action: "fetchFromOpenAI",
            message: response,
            model: model.value,
            detailLevel: detailLevel.value,
          });

          port.onMessage.addListener((response) => {
            // console.log("response received from background");
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

  return (
    <div className="App">
      {isOptionsOpen ? (
        <Options onGoBack={() => setIsOptionsOpen(false)} />
      ) : (
        <>
          <ChatHeader
            onClick={handleButtonClick}
            onStateChange={handleStateChange}
            onOpenOptions={() => setIsOptionsOpen(true)}
          />
          <ChatWindow messages={messages} />
          {/* <ChatInput onSendMessage={handleSendMessage} /> */}
        </>
      )}
    </div>
  );
};

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <Message key={index} sender={message.sender} text={message.text} />
      ))}
    </div>
  );
}

interface ChatHeaderProps {
  onClick: () => void;
  onStateChange: (model: ModelType, detailLevel: DetailLevelType) => void;
  onOpenOptions: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClick,
  onStateChange,
  onOpenOptions,
}) => {
  // Define types for the dropdown states

  // Declare state variables for the dropdowns with types
  const [selectedModel, setSelectedModel] = useState<ModelType>(
    modelOptions[0]
  );

  const [detailLevel, setDetailLevel] = useState<DetailLevelType>(
    detailOptions[0]
  );

  // Handle changes for the model dropdown with typed event
  // const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedModel(event.target.value);
  //   onStateChange(event.target.value, detailLevel);
  // };

  // Handle changes for the detail level dropdown with typed event
  const handleDetailLevelChange = (value: DetailLevelType) => {
    setDetailLevel(value as DetailLevelType);
    onStateChange(selectedModel, value);
  };

  return (
    <div
      id="chat-header"
      className=" flex flex-col justify-between w-full p-4 bg-gh-med-gray text-white fixed top-0 left-0 right-0 z-10 shadow-md"
    >
      <div id="chat-upper" className=" flex items-center w-full mb-2.5">
        <h1
          id="chat-title "
          className="flex text-lg font-medium items-center justify-center flex-1"
        >
          {title}
        </h1>
        <div id="chat-options" className="cogwheel " onClick={onOpenOptions}>
          <Cog6ToothIcon className="h-5 w-5 text-white-500 hover:text-gray-500" />
        </div>
      </div>
      <div id="chat-header-controls" className=" flex ">
        {" "}
        {/* Added flex class */}
        <div className="flex-1">
          <label className="block text-gray-500 font-bold mb-1 pr-4 text-center">
            {modelSelectLabel}
          </label>
          <Listbox value={selectedModel} onChange={setSelectedModel}>
            <div className="relative">
              <Listbox.Button className="block w-full text-left bg-gh-button-color text-white rounded-md px-4 py-2 flex">
                {selectedModel.label}
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400 flex-0"
                  aria-hidden="true"
                />
              </Listbox.Button>
              <Listbox.Options className="absolute mt-2 w-full py-1 bg-gh-button-color  border rounded-md shadow-lg">
                {modelOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    className={({ active }) =>
                      `${active ? "text-blue-900 bg-blue-100" : "text-gray-900"}
                       cursor-pointer select-none relative px-4 py-2`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="ml-2">{option.label}</span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <div className="flex-1">
          <label className="block text-gray-500 font-bold mb-1 pr-4 text-center">
            {detailSelectLabel}
          </label>
          <Listbox
            value={detailLevel}
            onChange={setDetailLevel}
            // className="flex-1"
          >
            {" "}
            {/* Added flex-1 class */}
            <div className="relative">
              <Listbox.Button className="block w-full text-left bg-gh-button-color text-white rounded-md px-4 py-2 flex items-center">
                {" "}
                {/* Added flex and items-center classes */}
                <span className="h-5 w-5 mr-2">{detailLevel.icon}</span>{" "}
                {detailLevel.label}
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400 flex-0"
                  aria-hidden="true"
                />
              </Listbox.Button>
              <Listbox.Options className="absolute mt-2 w-full py-1 bg-white border rounded-md shadow-lg">
                {detailOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    className={
                      ({ active }) =>
                        `${
                          active ? "text-blue-900 bg-blue-100" : "text-gray-900"
                        }
                 cursor-pointer select-none relative px-4 py-2 flex items-center` /* Added flex and items-center classes */
                    }
                  >
                    <span className="h-5 w-5 mr-2">{option.icon}</span>{" "}
                    {/* Added sizing classes */}
                    <span>{option.label}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <button
          className="bg-gh-button-color hover:bg-gh-button-hover hover:border-gh-button-hover-border active:bg-gh-button-active border-gh-button-border border-1 text-white rounded-md px-4 py-2 flex items-center"
          onClick={onClick}
        >
          {explainCodeButtonLabel}
        </button>
      </div>
    </div>
  );
};

function Message({ sender, text }) {
  // const htmlContent = marked(text);

  return (
    <div className={`message ${sender}`}>
      <p>{text}</p>
    </div>
  );
}

function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything about this repo :)"
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default Panel;
