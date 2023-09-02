import React from "react";
import "@pages/options/Options.css";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const Options: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
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
    <div className="options-page">
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded inline-flex items-center"
        onClick={onGoBack}
      >
        <ChevronLeftIcon className="h-5 w-5 mr-2" />
        Back to CodeScribe
      </button>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="apiKey"
          className="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
        >
          API Key:
          <input
            type="password"
            name="apiKey"
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="apiKey"
            placeholder="******************"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              chrome.storage.local.set({ openaiApiKey: e.target.value });
            }}
          />
        </label>
        <button
          type="submit"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded inline-flex items-center"
        >
          Submit
        </button>
      </form>
      <div id="apiKeyHelp" className="text-gray-200">
        Go to your{" "}
        <a
          href="https://beta.openai.com/account/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-blue-600"
        >
          {" "}
          OpenAI profile{" "}
        </a>{" "}
        and generate a new API key.
      </div>
    </div>
  );
};

export default Options;
