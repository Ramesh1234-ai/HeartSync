import {
  Code2,
  Terminal as TerminalIcon,
  FileCode,
  Copy,
  Save,
} from "lucide-react";
import Navbar from "../common/navbar";
import Sidebar from "../common/sidebar";
import { useState } from "react";

export default function Editor() {
  const [code, setCode] = useState(`// Write your code here...
  function helloWorld() {
    console.log('Welcome to ZecoAI');
    return 'AI Coding Assistant';
  }`);
  
  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Editor and Terminal Container */}
        <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
          {/* Code Editor Section */}
          <div className="flex-1 flex flex-col bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-blue-400" />
                <span className="text-sm font-semibold text-white">main.js</span>
              </div>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-zinc-700 rounded text-gray-400 hover:text-white transition" title="Copy">
                  <Copy size={16} />
                </button>
                <button className="p-1 hover:bg-zinc-700 rounded text-gray-400 hover:text-white transition" title="Save">
                  <Save size={16} />
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-zinc-900 text-green-400 font-mono text-sm p-6 focus:outline-none resize-none scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
              spellCheck="false"
            />
          </div>

          {/* Terminal Section */}
          <div className="flex-1 flex flex-col bg-black rounded-lg border border-zinc-800 overflow-hidden">
            <div className="flex items-center gap-2 bg-zinc-800 px-4 py-3 border-b border-zinc-700">
              <TerminalIcon size={16} className="text-green-400" />
              <span className="text-sm font-semibold text-white">Terminal</span>
            </div>
            <div className="flex-1 bg-black text-green-400 font-mono text-sm p-6 overflow-y-auto space-y-2">
              <div className="text-cyan-400">$ zeco-ai --version</div>
              <div>ZecoAI v1.0.0 - AI Coding Assistant</div>
              <div className="mt-4 text-cyan-400">$ npm run dev</div>
              <div className="text-yellow-400">⚡ Dev server running on localhost:5173</div>
              <div className="text-blue-400">✓ Webpack compiled successfully</div>
              <div className="mt-4">
                <span className="text-cyan-400">$ </span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
              