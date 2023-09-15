import React from "react";
import "@pages/options/Options.css";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Button from "@src/pages/content/components/Button";
import Header from "@src/pages/content/components/Header";

// Option props
interface OptionProps {
  onGoBack: () => void;
}

const Options: React.FC<OptionProps> = ({ onGoBack }) => {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["openaiApiKey"], ({ openaiApiKey }) => {
      setApiKey(openaiApiKey || "");
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission action
    chrome.storage.local.set({ openaiApiKey: apiKey });
  };

  return (
    <div className="flex flex-col text-gray-200">
      <Header
        upperHeaderProps={{
          title: "Options",
          leftActions: [
            {
              icon: <ChevronLeftIcon />,
              callback: onGoBack,
              tooltip: "Go Back",
            },
          ],
        }}
      />

      <form onSubmit={handleSubmit} className="flex flex-col mt-4 items-center">
        <div className="flex flex-row">
          <label
            htmlFor="apiKey"
            className="block text-gray-200 md:text-right pr-4 font-bold"
          >
            API Key:
            <input
              type="password"
              name="apiKey"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-sky-500 flex-grow"
              id="apiKey"
              placeholder="******************"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                chrome.storage.local.set({ openaiApiKey: e.target.value });
              }}
            />
          </label>
          <Button label="Save" onClick={handleSubmit} />
        </div>
        <div id="apiKeyHelp" className="text-gray-200 mt-2 justify-start">
          Go to your{" "}
          <a
            href="https://beta.openai.com/account/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-blue-600"
          >
            OpenAI profile
          </a>{" "}
          and generate a new API key.
        </div>
      </form>
    </div>
  );
};

export default Options;
