import React, { useState, useEffect, Fragment } from "react";
// import Button from "@src/pages/content/components/Button";
// import button from material-ui
import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import ClearIcon from "@src/pages/content/components/Icons/ClearIcon";
import Header from "@src/pages/content/components/Header";
import { Dialog, Transition } from "@headlessui/react";
import Modal from "@src/pages/content/components/Modal";

import { useCodeScribeContext } from "../panel/Panel";

// history props
interface HistoryProps {
  onGoBack: () => void;
}

const History: React.FC<HistoryProps> = ({ onGoBack }) => {
  const [storageItems, setStorageItems] = useState<Record<string, any>>({});
  // create state object of array of objects for grouped items
  const [groupedItems, setGroupedItems] = useState<Object>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { setMessages, showMainView } = useCodeScribeContext();

  const clearCodeDescriptionItems = () => {
    // setIsModalOpen(false);

    // Fetch all items from Chrome's local storage
    chrome.storage.local.get(null, (items) => {
      for (let key in items) {
        if (key.includes("codeDescription_")) {
          chrome.storage.local.remove(key, function () {
            var error = chrome.runtime.lastError;
            if (error) {
              console.error(error);
            }
          });
        }
      }
      setIsModalOpen(false);
      console.log("History cleared!");
      // Fetch all remaining items in storage to update the state
      //   chrome.storage.local.get(null, (updatedItems) => {
      //     setStorageItems(updatedItems);
      //     setGroupedItems(groupByRepo(updatedItems));
      //   });
      setStorageItems({});
      setGroupedItems({});
      setMessages([]);
    });
  };

  const showModal = () => {
    console.log("show modal");
    setIsModalOpen(true);
  };

  useEffect(() => {
    // Fetch all items from local storage
    chrome.storage.local.get(null, (items) => {
      // Filter items based on the keys value
      const filteredItems = Object.entries(items).reduce(
        (acc, [key, value]) => {
          if (key.includes("codeDescription_")) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

      setStorageItems(filteredItems);
      setGroupedItems(groupByRepo(filteredItems));
      //   console.log("history mounted");
    });
  }, []);

  // Helper function to group items by repo
  const groupByRepo = (items: Object) => {
    const githubUrlRegex = /https:\/\/github.com\/([^\/]+)\/([^\/]+)/;

    return Object.entries(items).reduce((acc, [key, value]: any) => {
      const match = value.url.match(githubUrlRegex);
      if (match) {
        const repoKey = `${match[1]}/${match[2]}`;
        if (!acc[repoKey]) {
          acc[repoKey] = [];
        }
        console.log(value);
        acc[repoKey].push(value);
        // console.log("pushed");
      }
      return acc;
    }, {});
  };

  return (
    <div
      id="history"
      className="flex flex-col text-gray-200 bg-gh-med-gray relative"
    >
      <Header
        upperHeaderProps={{
          title: "History",
          leftActions: [
            {
              icon: <ChevronLeftIcon onClick={onGoBack} />,
              callback: onGoBack,
              tooltip: "Go Back",
            },
          ],
          rightActions: [
            {
              icon: (
                <TrashIcon
                  className="h-5 w-5 text-red-500 hover:text-red-900"
                  title="Clear History"
                />
              ),
              callback: showModal,
              tooltip: "Clear History",
            },
          ],
        }}
      />
      <div
        id="history-items"
        className="flex-1 p-2 overflow-y-auto break-words text-gray-200 font-mono mt-4"
      >
        {Object.entries(groupedItems).map(([repo, files]) => (
          <div
            key={repo}
            className="mb-4 bg-gh-light-gray p-4 rounded-md shadow-lg"
          >
            <strong className="text-lg block border-b border-gray-700 pb-2 mb-2">
              {repo}
            </strong>
            <ul>
              {files.map((file, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setMessages([
                      {
                        sender: "CodeScribe (cached)",
                        text: file.description,
                        model: file.model,
                        detail: file.detail,
                        url: file.url,
                      },
                    ]);
                    showMainView();
                  }}
                  className="cursor-pointer bg-gh-button-color hover:bg-gh-button-hover hover:border-gh-button-hover-border active:bg-gh-button-active border-gh-button-border border-1 text-white rounded-md px-2 py-1 mb-1"
                >
                  {`${file.fileName}  (${file.model} - ${file.detail})`}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete the history? This cannot be undone."
        onConfirm={clearCodeDescriptionItems}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default History;
