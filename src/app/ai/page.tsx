"use client";

import { useState } from "react";

export default function AI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    if (!input) return;

    setMessages([...messages, "You: " + input, "AI: This is a demo response"]);

    setInput("");
  };

  return (
    <div className="p-10 flex flex-col h-screen">
      <h1 className="text-3xl font-bold mb-4">AI Assistant 🤖</h1>

      <div className="flex-1 border rounded p-4 mb-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>

      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          placeholder="Ask something..."
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
