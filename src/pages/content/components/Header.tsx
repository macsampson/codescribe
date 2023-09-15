import ListboxComponent from "./ListBox";
import Button from "./Button";
import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { Option } from "@src/types";

interface UpperHeaderProps {
  title: string;
  leftActions?: {
    icon: React.ReactNode;
    callback: () => void;
    tooltip?: string;
  }[];
  rightActions?: {
    icon: React.ReactNode;
    callback: () => void;
    tooltip?: string;
  }[];
}

const UpperHeader: React.FC<UpperHeaderProps> = ({
  title,
  leftActions,
  rightActions,
}) => (
  <div id="upper" className="flex items-center relative min-w-450 mb-2.5">
    <div id="l-buttons" className="absolute left-0 flex flex-row flex-0">
      {leftActions &&
        leftActions.map((action, index) => (
          <div
            key={index}
            className="cursor-pointer h-5 w-5 text-white-500 hover:text-gray-500"
            onClick={action.callback}
            title={action.tooltip || ""}
          >
            {action.icon}
          </div>
        ))}
    </div>

    <h1 id="title" className="text-lg font-medium text-center flex-1">
      {title}
    </h1>
    <div
      id="options"
      className="absolute right-0 flex flex-row flex-0 items-center space-x-2"
    >
      {rightActions &&
        rightActions.map((action, index) => (
          <div
            key={index}
            className="cursor-pointer h-5 w-5 text-white-500 hover:text-gray-500"
            onClick={action.callback}
            title={action.tooltip || ""}
          >
            {action.icon}
          </div>
        ))}
    </div>
  </div>
);

interface HeaderProps {
  listBoxes?: {
    label: string;
    value: Option;
    onChange: React.Dispatch<React.SetStateAction<Option>>;
    options: Option[];
    icon?: ReactElement;
  }[];
  button?: {
    label: string;
    icon: ReactElement;
    onClick: () => void;
  };
  upperHeaderProps: UpperHeaderProps;
}

const Header: React.FC<HeaderProps> = ({
  listBoxes,
  button,
  upperHeaderProps,
}) => (
  <div
    id="header"
    className="flex flex-col flex-none justify-between min-w-450 p-4 bg-gh-light-gray text-white top-0 left-0 right-0 z-10 shadow-md"
  >
    <UpperHeader {...upperHeaderProps} />
    <div id="chat-header-controls" className="flex justify-between">
      {listBoxes?.map((listBox, index) => (
        <ListboxComponent
          key={index}
          label={listBox.label}
          value={listBox.value}
          onChange={listBox.onChange}
          options={listBox.options}
          icon={listBox.icon}
        />
      ))}
      {button && (
        <Button
          label={button.label}
          icon={button.icon}
          onClick={button.onClick}
        />
      )}
    </div>
  </div>
);

export default Header;
