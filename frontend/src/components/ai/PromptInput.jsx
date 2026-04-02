import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
/**
 * PromptInput Component
 * Text input area for user to type messages/code prompts
 * Has "Ask AI" button to submit
 */
function PromptInput({ onSubmit, isLoading, placeholder = "Ask ZecoAI..." }) {
  const [input, setInput] = useState("");
  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSubmit(input);
    setInput("");
  };

  /**
   * Handle Enter key press (Shift+Enter for new line)
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-zinc-700 bg-zinc-900/50 p-4"
    >
      <div className="flex gap-3 items-end">
        {/* Input Area */}
        <div className="flex-1 flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows="3"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors font-medium h-fit"
          title="Send message (Ctrl+Enter)"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Thinking...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span className="hidden sm:inline">Ask AI</span>
            </>
          )}
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-white/40 mt-2">
        Tip: Use Shift+Enter for line breaks, Enter to send
      </p>
    </form>
  );
}
export default PromptInput;
