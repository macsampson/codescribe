import React, { useState, useEffect } from "react";
import { BoltIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ModelType, DetailLevelType } from "@src/types";
import {
  title,
  modelSelectLabel,
  detailSelectLabel,
  explainCodeButtonLabel,
  modelOptions,
  detailOptions,
} from "@src/constants";
import ListboxComponent from "@src/pages/content/components/ListBox";
import Button from "@src/pages/content/components/Button";

// interface ButtonProps {
//   label: string;
//   icon: JSX.Element;
//   onClick: () => void;
// }

// // Button Component
// const Button: React.FC<ButtonProps> = ({ label, icon, onClick }) => (
//   <button
//     className="w-36 h-9.5 self-end bg-gh-button-color hover:bg-gh-button-hover hover:border-gh-button-hover-border active:bg-gh-button-active border-gh-button-border border-1 text-white rounded-md px-4 py-2 flex items-center"
//     onClick={onClick}
//   >
//     <div className="w-36 flex items-center flex-grow justify-center">
//       <span className="h-5 w-5 mr-2">{icon}</span>
//       {label}
//     </div>
//   </button>
// );

interface UpperHeaderProps {
  title: string;
  onOpenOptions: () => void;
}

// Header Component
const UpperHeader: React.FC<UpperHeaderProps> = ({ title, onOpenOptions }) => (
  <div id="chat-upper" className="flex items-center min-w-450 mb-2.5">
    <h1
      id="chat-title"
      className="flex text-lg font-medium items-center justify-center flex-1"
    >
      {title}
    </h1>
    <div id="chat-options" className="cogwheel" onClick={onOpenOptions}>
      <Cog6ToothIcon className="h-5 w-5 text-white-500 hover:text-gray-500" />
    </div>
  </div>
);

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

  // Update the state of the parent component when the dropdowns change
  useEffect(() => {
    onStateChange(selectedModel, detailLevel);
  }, [selectedModel, detailLevel]);

  return (
    <div
      id="chat-header"
      className="flex flex-col flex-none justify-between min-w-450 p-4 bg-gh-med-gray text-white top-0 left-0 right-0 z-10 shadow-md"
    >
      <UpperHeader title={title} onOpenOptions={onOpenOptions} />
      <div id="chat-header-controls" className="flex justify-between">
        <ListboxComponent
          label={modelSelectLabel}
          value={selectedModel}
          onChange={setSelectedModel}
          options={modelOptions}
          icon={selectedModel.icon}
        />
        <ListboxComponent
          label={detailSelectLabel}
          value={detailLevel}
          onChange={setDetailLevel}
          options={detailOptions}
          icon={detailLevel.icon}
        />
        <Button
          label={explainCodeButtonLabel}
          icon={<BoltIcon />}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
