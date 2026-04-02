import { Copy, Save, Play, Brain, Terminal as TerminalIcon, FileCode } from "lucide-react";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

/**
 * CodeEditor Component
 * Main editor area where users write and edit code
 * Features:
 * - Monaco Editor with syntax highlighting
 * - Auto language detection based on file extension
 * - Auto-save to localStorage
 * - Code copy, save, and run functions
 * - AI chat integration
 */

/**
 * Detect programming language based on file extension
 */
const detectLanguage = (filename) => {
  if (!filename) return "javascript";
  
  const ext = filename.split(".").pop()?.toLowerCase();
  const languageMap = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    rb: "ruby",
    go: "go",
    rs: "rust",
    php: "php",
    swift: "swift",
    kt: "kotlin",
    sql: "sql",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    markdown: "markdown",
    md: "markdown",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
  };
  
  return languageMap[ext] || "javascript";
};

function CodeEditor({ activeFile, project, onContentChange, onOpenAI }) {
  const [isSaved, setIsSaved] = useState(true);
  const [editorContent, setEditorContent] = useState("");
  const [language, setLanguage] = useState({
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    rb: "ruby",
    go: "go",
    rs: "rust",
    php: "php",
    swift: "swift",
    kt: "kotlin",
    sql: "sql",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    markdown: "markdown",
    md: "markdown",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
});
  const [selectedCode, setSelectedCode] = useState("");

  /**
   * Update editor content and detect language when active file changes
   */
  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content);
      setLanguage(detectLanguage(activeFile.name));
      setIsSaved(true);
      setSelectedCode("");
    }
  }, [activeFile]);

  /**
   * Handle content change and propagate to parent
   */
  const handleContentChange = (newContent) => {
    if (newContent !== undefined) {
      setEditorContent(newContent);
      setIsSaved(false);
      onContentChange(newContent);
      setIsSaved(true); // Mark as saved since we auto-save
    }
  };

  /**
   * Handle Monaco editor mount - setup event listeners
   */
  const handleEditorMount = (editor, monaco) => {
    // Track text selection
    editor.onDidChangeCursorSelection((e) => {
      const selection = editor.getModel().getValueInRange(e.selection);
      setSelectedCode(selection || "");
    });
  };

  /**
   * Send selected code or full file to AI chat
   */
  const handleAskAI = () => {
    const codeToSend = selectedCode || editorContent;
    if (!codeToSend.trim()) {
      alert("No code selected. Using entire file.");
      setSelectedCode("");
    }
    // Call the parent's onOpenAI callback - AI component will use activeFile.content
    onOpenAI?.();
  };
  /**
   * Copy code to clipboard
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    alert("Code copied to clipboard!");
  };

  /** 
   * Save code (auto-save is already happening, this is for explicit save feedback)
   */
  const handleSave = () => {
    setIsSaved(true);
    alert("Project saved successfully!");
  };
   const handlecode=()=>{
    const [code,setcode]=useState();

   }
  /**
   * Run the code (simulated)
   */
  const handleRun = () => {
    alert(`Running project: ${project?.name}\n\nOutput:\nCode executed successfully!`);
  };

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <FileCode size={64} className="text-white/30 mx-auto mb-4" />
          <p className="text-white/50">No file selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
      {/* Editor Header */}
      <div className="h-16 border-b border-zinc-700 px-6 py-3 flex items-center justify-between bg-zinc-900">
        <div className="flex items-center gap-3">
          <FileCode size={18} className="text-blue-400" />
          <div>
            <h2 className="text-sm font-semibold text-white">{activeFile.name}</h2>
            <p className="text-xs text-white/50">{project?.name}</p>
          </div>
          {!isSaved && (
            <span className="ml-2 w-2 h-2 bg-yellow-400 rounded-full"></span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-600 text-white/70 hover:text-white hover:border-zinc-500 transition-colors text-xs font-medium"
            title="Copy code"
          >
            <Copy size={16} />
            Copy
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-xs font-medium"
            title="Save file"
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 transition-colors text-xs font-medium"
            title="Run project"
          >
            <Play size={16} />
            Run
          </button>
          <button
            onClick={handleAskAI}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black transition-colors text-xs font-bold shadow-lg"
            title="Ask AI for help"
          >
            <Brain size={16} />
            Ask AI
            {selectedCode && <span className="text-xs">({selectedCode.length} chars)</span>}
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          {/* Editor Label */}
          <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700">
            <p className="text-xs text-white/50">Code Editor</p>
          </div>

          {/* Monaco Editor */}
          <Editor
            height="100%"
            language={language}
            value={editorContent}
            onChange={handleContentChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
              tabSize: 2,
              fontSize: 14,
              fontFamily: "'Monaco', 'Menlo', 'Consolas', 'monospace'",
              automaticLayout: true,
              smoothScrolling: true,
              padding: { top: 16, bottom: 16 },
              selectionHighlight: true,
              occurrencesHighlight: "on",
              readOnly: false,
            }}
          />
        </div>

        {/* Terminal/Output */}
        <div className="flex-1 flex flex-col bg-black rounded-lg border border-zinc-800 overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 bg-zinc-800 px-4 py-3 border-b border-zinc-700">
            <TerminalIcon size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-white">Terminal Output</span>          </div>

          {/* Terminal Content */}
          <div className="flex-1 bg-black text-green-400 font-mono text-sm p-6 overflow-y-auto space-y-2">
            <div className="text-cyan-400">$ zeco-ai --run {activeFile.name}</div>
            <div className="text-yellow-400">⚡ Executing file...</div>
            <div className="text-green-400">✓ File loaded successfully</div>
            <div className="mt-4">
              <span className="text-cyan-400">$ </span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
