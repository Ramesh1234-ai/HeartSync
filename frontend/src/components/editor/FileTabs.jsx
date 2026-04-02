import { X } from "lucide-react";

/**
 * FileTabs Component
 * Displays tabs for open files at the top of the editor
 * Features:
 * - Click to switch between files
 * - Close button (x) to close tab
 * - Shows modified indicator (•) for unsaved files
 * - Horizontal scroll for many files
 * - Active tab highlighting
 */
function FileTabs({ files, activeFileId, onSelectFile, onCloseFile, unsavedFiles }) {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 bg-zinc-800/50 border-b border-zinc-700 px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-600">
      {files.map((file) => (
        <div
          key={file.id}
          className={`flex items-center gap-2 px-3 py-1 rounded-t-lg border-b-2 transition-colors cursor-pointer group whitespace-nowrap ${
            activeFileId === file.id
              ? "bg-zinc-900 border-yellow-500 text-white"
              : "bg-zinc-800/50 border-transparent text-white/60 hover:text-white hover:bg-zinc-800"
          }`}
          onClick={() => onSelectFile(file.id)}
        >
          {/* File Icon and Name */}
          <span className="text-xs font-medium truncate max-w-[120px]">
            {file.name}
          </span>

          {/* Modified Indicator */}
          {unsavedFiles?.includes(file.id) && (
            <span className="text-yellow-400 text-lg leading-none">•</span>
          )}

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseFile(file.id);
            }}
            className="ml-1 p-0.5 rounded-md hover:bg-zinc-700 text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            title="Close file"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default FileTabs;
