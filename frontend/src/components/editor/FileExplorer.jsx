import { ChevronDown, Plus, Trash2, File, Folder } from "lucide-react";
import { useState } from "react";

/**
 * FileExplorer Component
 * Displays a file tree structure similar to VS Code
 * Allows selecting, creating, and deleting files
 */
function FileExplorer({
  project,
  activeFileId,
  onSelectFile,
  onAddFile,
  onDeleteFile,
}) {
  const [expandedFolders, setExpandedFolders] = useState({});
  /**
   * Handle file click to select it
   */
  const handleFileClick = (fileId) => {
    onSelectFile(fileId);
  };
  /**
   * Handle delete with confirmation
   */
  const handleDelete = (e, fileId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this file?")) {
      onDeleteFile(fileId);
    }
  };
  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Explorer</h3>
            <p className="text-xs text-white/40 mt-1">{project?.name}</p>
          </div>
        </div>
        
        {/* Add File Button */}
        <button
          onClick={onAddFile}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 px-3 rounded-lg transition-colors font-medium"
        >
          <Plus size={16} />
          New File
        </button>
      </div>
      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {project?.files && project.files.length > 0 ? (
          project.files.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file.id)}
              className={`
                group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                transition-all duration-200 ${
                  activeFileId === file.id
                    ? "bg-indigo-500/20 border border-indigo-500/30"
                    : "hover:bg-white/[0.06] border border-transparent"
                }
              `}
            >
              {/* File Icon and Name */}
              <div className="flex items-center gap-2 min-w-0">
                <File
                  size={16}
                  className={
                    activeFileId === file.id
                      ? "text-indigo-400"
                      : "text-white/50"
                  }
                />
                <span
                  className={`
                    text-sm truncate ${
                      activeFileId === file.id
                        ? "text-indigo-300 font-semibold"
                        : "text-white/70"
                    }
                  `}
                >
                  {file.name}
                </span>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(e, file.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-all"
                title="Delete file"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-white/40 text-sm">No files yet</p>
            <p className="text-white/30 text-xs mt-2">Click "New File" to create one</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-zinc-800 px-4 py-3 text-xs text-white/50">
        <p>{project?.files?.length || 0} file{(project?.files?.length || 0) !== 1 ? "s" : ""}</p>
        <p className="mt-1">Last modified: {new Date(project?.lastModified || Date.now()).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
export default FileExplorer;
