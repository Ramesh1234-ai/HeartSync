import { FolderOpen, Edit2, Trash2, Share2, Code2 } from "lucide-react";

export default function ProjectCard({ project, onOpen, onEdit, onDelete, onShare }) {
  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
      {/* Header with icon */}
      <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 px-6 py-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <FolderOpen size={24} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white truncate">{project.name}</h3>
            <p className="text-xs text-white/40 mt-1">
              {project.files?.length || 0} files
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-3">
        {/* Language/Tech Stack */}
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-indigo-400" />
          <span className="text-sm text-white/60">{project.language || "JavaScript"}</span>
        </div>

        {/* Stats */}
        <div className="text-sm text-white/50 space-y-1">
          <p>Created: {new Date(project.id).toLocaleDateString()}</p>
          {project.lastModified && (
            <p>Modified: {new Date(project.lastModified).toLocaleDateString()}</p>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-zinc-800 flex gap-2">
        <button
          onClick={() => onOpen?.(project)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg transition-colors font-medium"
        >
          Open
        </button>
        <button
          onClick={() => onShare?.(project)}
          className="p-2 rounded-lg border border-zinc-700 text-white/60 hover:text-white hover:border-indigo-500/50 transition-colors"
          title="Share"
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={() => onEdit?.(project)}
          className="p-2 rounded-lg border border-zinc-700 text-white/60 hover:text-white hover:border-indigo-500/50 transition-colors"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete?.(project)}
          className="p-2 rounded-lg border border-zinc-700 text-white/60 hover:text-red-400 hover:border-red-500/50 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}