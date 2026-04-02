import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";

/**
 * MessageBubble Component
 * Displays individual chat messages (user or AI)
 * User messages appear on right, AI messages on left
 */
function MessageBubble({ message, isUser }) {
  const [copied, setCopied] = useState(false);
  /**
   * Copy message content to clipboard
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          max-w-xs lg:max-w-md px-4 py-3 rounded-lg relative group
          ${
            isUser
              ? "bg-indigo-600 text-white rounded-br-none"
              : "bg-zinc-800 text-white/90 rounded-bl-none border border-zinc-700"
          }
        `}
      >
        {/* AI Badge */}
        {!isUser && (
          <div className="flex items-center gap-1 mb-2 pb-2 border-b border-zinc-700/50">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-xs font-semibold text-white/70">ZecoAI</span>
          </div>
        )}

        {/* Message Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {/* Copy Button (appears on hover) */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
          title="Copy message"
        >
          {copied ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-white/60" />
          )}
        </button>
      </div>
    </div>
  );
}
export default MessageBubble;
