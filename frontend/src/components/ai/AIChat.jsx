import { useState, useEffect, useRef } from "react";
import { Brain, X } from "lucide-react";
import MessageBubble from "./MessageBubble";
import PromptInput from "./PromptInput";

/**
 * Trim text to maximum 100 words
 */
const trimTo100Words = (text) => {
  const words = text.split(/\s+/);
  if (words.length > 100) {
    return words.slice(0, 100).join(" ") + "...";
  }
  return text;
};

/**
 * AIChat Component
 * Main chat interface for interacting with ZecoAI
 * Manages messages and connects to backend AI API
 */
function AIChat({ activeFile, onClose, isOpen }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Call backend AI API
   * Sends code and prompt to the Gemini AI via backend endpoint
   */
  const callAIApi = async (code, prompt) => {
    try {
      const response = await fetch("http://localhost:3000/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          prompt: prompt,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return data.reply;
      } else {
        return `Error: ${data.message || "Failed to get AI response"}`;
      }
    } catch (error) {
      console.error("API Error:", error);
      return `Connection error: Unable to reach AI service. ${error.message}`;
    }
  };

  /**
   * Handle user message submission
   */
  const handleSubmitMessage = async (userInput) => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage = {
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Call AI API with code and prompt
    const codeContent = activeFile?.content || "";
    const aiResponseText = await callAIApi(codeContent, userInput);
    
    // Trim response to 100 words
    const trimmedResponse = trimTo100Words(aiResponseText);

    const aiMessage = {
      role: "ai",
      content: trimmedResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  /**
   * Handle "Analyze Code" quick action
   * Sends active file content as context
   */
  const handleAnalyzeCode = () => {
    if (!activeFile?.content) {
      alert("No active file to analyze");
      return;
    }

    const prompt = `Please analyze this code from ${activeFile.name}:\n\n\`\`\`\n${activeFile.content}\n\`\`\`\n\nProvide suggestions for improvements, potential bugs, and best practices.`;
    handleSubmitMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-700 rounded overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-4 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-yellow-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">ZecoAI Assistant</h3>
            <p className="text-xs text-white/40">
              {activeFile ? `Analyzing ${activeFile.name}` : "Ready to help"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/[0.06] rounded-lg text-white/60 hover:text-white transition-colors"
          title="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          // Empty State
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-zinc-800/50 rounded-full p-3 mb-4">
              <Brain size={32} className="text-yellow-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Welcome to ZecoAI
            </h2>
            <p className="text-white/50 text-sm mb-6 max-w-xs">
              Ask me anything about your code. I can help with:
            </p>
            <ul className="text-white/40 text-xs space-y-1 mb-6">
              <li>• Code reviews and improvements</li>
              <li>• Bug detection and fixes</li>
              <li>• Performance optimization</li>
              <li>• Best practices</li>
            </ul>

            {/* Quick Actions */}
            {activeFile && (
              <button
                onClick={handleAnalyzeCode}
                className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Brain size={16} />
                Analyze Current File
              </button>
            )}
          </div>
        ) : (
          // Messages List
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isUser={message.role === "user"}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-zinc-800 text-white/90 rounded-lg rounded-bl-none px-4 py-3 border border-zinc-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-xs text-white/60">ZecoAI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll Target */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <PromptInput
        onSubmit={handleSubmitMessage}
        isLoading={isLoading}
        placeholder={
          activeFile
            ? `Ask about ${activeFile.name}...`
            : "Ask ZecoAI something..."
        }
      />
    </div>
  );
}
export default AIChat;
