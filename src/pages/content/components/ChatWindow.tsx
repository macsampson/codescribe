import React, { useState } from "react";
import Message from "@pages/content/components/Message";

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
        <Message
          key={index}
          sender={message.sender}
          text={message.text}
          model={message.model}
        />
      ))}
    </div>
  );
}

export default ChatWindow;
