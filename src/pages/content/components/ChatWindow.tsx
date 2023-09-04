import React, { useState } from "react";

// function Message({ sender, text }) {
//   // const htmlContent = marked(text);

//   return (
//     <div className={`message ${sender}`}>
//       <p>{text}</p>
//     </div>
//   );
// }

import { useMarkdownProcessor } from "@root/src/shared/hooks/useMarkdownProcessor";

interface Props {
  sender: string;
  text: string;
}

const Message = ({ sender, text }: Props) => {
  const content = useMarkdownProcessor(text);
  // console.log(content);
  return (
    <li className="flex flex-col lex-1 min-w-0 gap-1 selection:bg-sky-300 selection:text-sky-900">
      <p className="font-sans text-xs font-medium text-sky-500 mt-2">
        {sender}
      </p>
      <div className="p-2 lg:p-6 border-2 border-sky-300 rounded-lg bg-sky-50 text-sky-900 min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {content}
      </div>
    </li>
  );
};

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

function ChatWindow({ messages }) {
  return (
    <div
      id="chat-window"
      className="overflow-y-auto p-2.5 flex flex-col-reverse flex-grow my-2"
    >
      {messages.map((message, index) => (
        <Message key={index} sender={message.sender} text={message.text} />
      ))}
    </div>
  );
}

export default ChatWindow;
