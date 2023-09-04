import React from "react";
import { Menu, Listbox } from "@headlessui/react";
import "@pages/panel/Panel.css";
// import CodeExplain from "@pages/content/components/CodeExplainerOutput/codeExplainerOutput";
import { useState, useEffect } from "react";
// import * as marked from "marked";
import Options from "@pages/options/Options";
import {
  Cog6ToothIcon,
  BoltIcon,
  Bars2Icon,
  Bars4Icon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import ChatHeader from "@src/pages/content/components/ChatHeader";
import ChatWindow from "@src/pages/content/components/ChatWindow";
import ListboxComponent from "@src/pages/content/components/ListBox";

import { ModelType, DetailLevelType, githubCodeResponse } from "@src/types";
import { modelOptions, detailOptions } from "@src/constants";

// const title = "CodeScribe for GitHub";
// const modelSelectLabel = "Model Selection";
// const detailSelectLabel = "Response Detail";
// const explainCodeButtonLabel = "Explain Code";

// interface githubCodeResponse {
//   code: string;
//   fileName: string;
// }

// interface Option {
//   id: number;
//   label: string;
//   icon?: JSX.Element; // This is just a guess; update it to your needs.
// }

// type ModelType = {
//   id: number;
//   label: string;
//   value: string;
// };

// type DetailLevelType = {
//   id: number;
//   label: string;
//   value: string;
//   icon: JSX.Element;
// };

// const detailOptions = [
//   { id: 1, label: "Concise", value: "concise", icon: <Bars2Icon /> },
//   { id: 2, label: "Detailed", value: "detailed", icon: <Bars4Icon /> },
//   // Add other detail options as needed
// ];

// const modelOptions = [
//   { id: 1, label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
//   { id: 2, label: "GPT-4", value: "gpt-4" },
// ];

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
    <div className="App flex flex-col h-screen">
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

// interface UpperHeaderProps {
//   title: string;
//   onOpenOptions: () => void;
// }

// // Header Component
// const UpperHeader: React.FC<UpperHeaderProps> = ({ title, onOpenOptions }) => (
//   <div id="chat-upper" className="flex items-center min-w-450 mb-2.5">
//     <h1
//       id="chat-title"
//       className="flex text-lg font-medium items-center justify-center flex-1"
//     >
//       {title}
//     </h1>
//     <div id="chat-options" className="cogwheel" onClick={onOpenOptions}>
//       <Cog6ToothIcon className="h-5 w-5 text-white-500 hover:text-gray-500" />
//     </div>
//   </div>
// );

// interface ListboxProps {
//   label: string;
//   value: Option;
//   onChange: React.Dispatch<React.SetStateAction<Option>>;
//   options: Option[];
//   icon?: JSX.Element;
// }

// ListboxComponent
// const ListboxComponent: React.FC<ListboxProps> = ({
//   label,
//   value,
//   onChange,
//   options,
//   icon,
// }) => (
//   <div className="flex-col">
//     <label className="block text-gray-500 font-bold mb-1 text-center">
//       {label}
//     </label>
//     <Listbox value={value} onChange={onChange}>
//       <div className="relative">
//         <Listbox.Button className="block w-full text-left bg-gh-button-color hover:bg-gh-button-hover hover:border-gh-button-hover-border active:bg-gh-button-active border-gh-button-border border-1 text-white rounded-md px-4 py-2 flex items-center">
//           {icon && <span className="h-5 w-5 mr-2">{icon}</span>}
//           {value.label}
//           <ChevronUpDownIcon
//             className="h-5 w-5 ml-4 text-gray-400"
//             aria-hidden="true"
//           />
//         </Listbox.Button>
//         <Listbox.Options className="absolute mt-2 w-full bg-gh-button-color border-gh-button-border border-1 rounded-md shadow-lg">
//           {options.map((option) => (
//             <Listbox.Option
//               key={option.id}
//               value={option}
//               className={({ active }) =>
//                 `${
//                   active
//                     ? "text-gh-text-color bg-gh-button-hover rounded-md"
//                     : "text-gh-text-color"
//                 } cursor-pointer select-none relative m-1 px-4 py-2 flex`
//               }
//             >
//               {({ selected }) => (
//                 <>
//                   {option.icon && (
//                     <span className="h-5 w-5 mr-2">{option.icon}</span>
//                   )}
//                   <span className="ml-2">{option.label}</span>
//                   {selected && (
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
//                   )}
//                 </>
//               )}
//             </Listbox.Option>
//           ))}
//         </Listbox.Options>
//       </div>
//     </Listbox>
//   </div>
// );

// interface ButtonProps {
//   label: string;
//   icon: JSX.Element;
//   onClick: () => void;
// }

// // Button Component
// const Button: React.FC<ButtonProps> = ({ label, icon, onClick }) => (
//   <button
//     className="h-9.5 self-end bg-gh-button-color hover:bg-gh-button-hover hover:border-gh-button-hover-border active:bg-gh-button-active border-gh-button-border border-1 text-white rounded-md px-4 py-2 flex items-center flex"
//     onClick={onClick}
//   >
//     <span className="h-5 w-5 mr-2">{icon}</span>
//     {label}
//   </button>
// );

// function ChatWindow({ messages }) {
//   return (
//     <div
//       id="chat-window"
//       className="overflow-y-auto p-2.5 flex flex-col-reverse flex-grow mt-2"
//     >
//       {messages.map((message, index) => (
//         <Message key={index} sender={message.sender} text={message.text} />
//       ))}
//     </div>
//   );
// }

// interface ChatHeaderProps {
//   onClick: () => void;
//   onStateChange: (model: ModelType, detailLevel: DetailLevelType) => void;
//   onOpenOptions: () => void;
// }

// const ChatHeader: React.FC<ChatHeaderProps> = ({
//   onClick,
//   onStateChange,
//   onOpenOptions,
// }) => {
//   // Define types for the dropdown states

//   // Declare state variables for the dropdowns with types
//   const [selectedModel, setSelectedModel] = useState<ModelType>(
//     modelOptions[0]
//   );

//   const [detailLevel, setDetailLevel] = useState<DetailLevelType>(
//     detailOptions[0]
//   );

//   return (
//     <div
//       id="chat-header"
//       className="flex flex-col flex-none justify-between min-w-450 p-4 bg-gh-med-gray text-white top-0 left-0 right-0 z-10 shadow-md"
//     >
//       <UpperHeader title={title} onOpenOptions={onOpenOptions} />
//       <div id="chat-header-controls" className="flex justify-between">
//         <ListboxComponent
//           label={modelSelectLabel}
//           value={selectedModel}
//           onChange={setSelectedModel}
//           options={modelOptions}
//         />
//         <ListboxComponent
//           label={detailSelectLabel}
//           value={detailLevel}
//           onChange={setDetailLevel}
//           options={detailOptions}
//           icon={detailLevel.icon}
//         />
//         <Button
//           label={explainCodeButtonLabel}
//           icon={<BoltIcon />}
//           onClick={onClick}
//         />
//       </div>
//     </div>
//   );
// };

// function Message({ sender, text }) {
//   // const htmlContent = marked(text);

//   return (
//     <div className={`message ${sender}`}>
//       <p>{text}</p>
//     </div>
//   );
// }

// function ChatInput({ onSendMessage }) {
//   const [input, setInput] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       onSendMessage(input.trim());
//       setInput("");
//     }
//   };

//   return (
//     <form className="chat-input" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Ask anything about this repo :)"
//       />
//       <button type="submit">Send</button>
//     </form>
//   );
// }

export default Panel;
