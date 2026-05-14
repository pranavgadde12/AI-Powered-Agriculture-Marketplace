"use client";

import { useState } from "react";
import { chatWithAI } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"farmer" | "customer">("farmer");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await chatWithAI(input, mode);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError("Error: " + err.message);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Sorry, I encountered an error. Please make sure the backend is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const switchMode = (newMode: "farmer" | "customer") => {
    setMode(newMode);
    setMessages([]);
    setError("");
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Farm Advisor AI</h1>
      <p className="text-gray-600 mb-6">Powered by Claude AI</p>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchMode("farmer")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            mode === "farmer"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          I&apos;m a Farmer
        </button>
        <button
          onClick={() => switchMode("customer")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            mode === "customer"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          I&apos;m a Customer
        </button>
      </div>

      {/* Mode Description */}
      <div
        className={`mb-4 px-4 py-2 rounded text-sm ${
          mode === "farmer"
            ? "bg-green-50 text-green-800"
            : "bg-blue-50 text-blue-800"
        }`}
      >
        {mode === "farmer"
          ? "Farmer mode: Ask about crop advice, soil health, pest control, irrigation, and livestock."
          : "Customer mode: Ask about product origin, farming methods, freshness, and food safety."}
      </div>

      {/* Chat Container */}
      <div className="border rounded-lg bg-gray-50 p-6 h-96 overflow-y-auto mb-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg font-semibold">Hello! I&apos;m your Farm Advisor.</p>
            <p className="mt-1">
              {mode === "farmer"
                ? "Ask me about crops, soil, pests, or irrigation."
                : "Ask me about product quality, origin, or farming methods."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white border text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border text-gray-800 px-4 py-3 rounded-lg rounded-bl-none shadow-sm">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            mode === "farmer"
              ? "Ask about crops, soil, pests... (Enter to send)"
              : "Ask about product quality, origin... (Enter to send)"
          }
          rows={3}
          disabled={loading}
          className="flex-1 border rounded p-3 font-sans focus:outline-none focus:border-green-600 disabled:bg-gray-100 resize-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 h-fit self-end"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
