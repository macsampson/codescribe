import useMarkdownProcessor from "@root/utils/useMarkdownProcessor";

interface Props {
  sender: string;
  model: string;
  detail: string;
  text: string;
  url: string;
}

const Message = ({ sender, text, model, detail, url }: Props) => {
  const content = useMarkdownProcessor(text, model);

  const computeStyle = (model: string) => {
    switch (model) {
      case "gpt-3.5-turbo":
        return {
          contentClass:
            "bg-gray-800 text-white selection:bg-green-300 selection:text-green-900",
          senderClass: "text-green-500",
          borderClass: "bg-gradient-to-r from-green-400 to-green-700",
        };
      case "gpt-4":
        return {
          contentClass:
            "bg-gray-800 text-white selection:bg-purple-300 selection:text-purple-900",
          senderClass: "text-purple-300",
          borderClass: "bg-gradient-to-r from-blue-500 to-pink-500",
        };
      default:
        return {
          contentClass:
            "bg-gray-800 text-white selection:bg-sky-300 selection:text-sky-900",
          senderClass: "text-sky-500",
          borderClass: "bg-gradient-to-r from-sky-400 to-sky-700",
        };
    }
  };

  const { contentClass, senderClass, borderClass } = computeStyle(model);

  const handleClick = () => {
    // Send a message to the background script to navigate to the URL
    chrome.runtime.sendMessage({ action: "navigateToURL", url: url });
  };

  return (
    <li className={`flex flex-col min-w-0 gap-1`}>
      <p className={`font-sans text-xs font-medium mt-2 ${senderClass}`}>
        {sender}
        {model && ` (${model})`}
        {url && (
          <span onClick={handleClick} className="ml-2 underline cursor-pointer">
            View Source
          </span>
        )}
      </p>
      <div className="items-center justify-center">
        <div className={`w-full rounded-md p-1 ${borderClass}`}>
          <div
            className={`p-2 lg:p-6 rounded-md [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${contentClass}`}
          >
            {content}
          </div>
        </div>
      </div>
    </li>
  );
};

export default Message;
