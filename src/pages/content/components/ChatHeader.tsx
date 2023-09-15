import React, { useState, useEffect } from "react";
import { BoltIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ModelType, DetailLevelType } from "@src/types";
import {
  title as chatTitle,
  modelSelectLabel,
  detailSelectLabel,
  explainCodeButtonLabel,
  modelOptions,
  detailOptions,
} from "@src/constants";
import ListboxComponent from "@src/pages/content/components/ListBox";
import HistoryIcon from "./Icons/HistoryIcon";
import Header from "./Header";

interface ChatHeaderProps {
  onClick: () => void;
  onStateChange: (model: ModelType, detailLevel: DetailLevelType) => void;
  onOpenOptions: () => void;
  onOpenHistory: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClick,
  onStateChange,
  onOpenOptions,
  onOpenHistory,
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelType>(
    modelOptions[0]
  );
  const [detailLevel, setDetailLevel] = useState<DetailLevelType>(
    detailOptions[0]
  );

  useEffect(() => {
    onStateChange(selectedModel, detailLevel);
  }, [selectedModel, detailLevel]);

  return (
    <Header
      upperHeaderProps={{
        title: chatTitle,
        rightActions: [
          {
            icon: (
              <HistoryIcon className="h-5 w-5 text-white-500 hover:text-gray-500" />
            ),
            callback: onOpenHistory,
            tooltip: "Show History",
          },
          {
            icon: (
              <Cog6ToothIcon className="h-5 w-5 text-white-500 hover:text-gray-500" />
            ),
            callback: onOpenOptions,
            tooltip: "Show Options",
          },
        ],
      }}
      listBoxes={[
        {
          label: modelSelectLabel,
          value: selectedModel,
          onChange: setSelectedModel,
          options: modelOptions,
          icon: selectedModel.icon,
        },
        {
          label: detailSelectLabel,
          value: detailLevel,
          onChange: setDetailLevel,
          options: detailOptions,
          icon: detailLevel.icon,
        },
      ]}
      button={{
        label: explainCodeButtonLabel,
        icon: <BoltIcon />,
        onClick,
      }}
    />
  );
};

export default ChatHeader;
