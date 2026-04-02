import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../common/navbar";
import Sidebar from "../common/sidebar";
import FileExplorer from "./FileExplorer";
import FileTabs from "./FileTabs";
import CodeEditor from "./CodeEditor";
import AIChat from "../ai/AIChat";

/**
 * Main Editor Component
 * 
 * Manages:
 * - Project and file state from localStorage
 * - Active file selection
 * - File creation, deletion, and content updates
 * - Auto-save to localStorage
 * - AI chat panel visibility
 * - Unsaved file tracking
 * 
 * Features:
 * - File tabs for quick switching
 * - Auto-save on content change
 * - Language detection for syntax highlighting
 * - AI chat integration
 */
function Editor() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [unsavedFiles, setUnsavedFiles] = useState([]);

  /**
   * Load project from localStorage on component mount
   * Also set the first file as active by default
   */
  useEffect(() => {
    try {
      const projects = JSON.parse(localStorage.getItem("projects")) || [];
      const foundProject = projects.find(p => p.id === projectId || p.id === Number(projectId));

      if (!foundProject) {
        setError("Project not found");
        setLoading(false);
        return;
      }

      // Initialize files if they don't exist
      if (!foundProject.files || foundProject.files.length === 0) {
        foundProject.files = [
          {
            id: Date.now(),
            name: "index.js",
            content: `// ${foundProject.name}\n// Welcome to ZecoAI Editor\n\nfunction main() {\n  console.log('Hello from ${foundProject.name}');\n}\n\nmain();`,
          },
        ];
        // Save the initialized project
        const projectIndex = projects.findIndex(p => p.id === projectId || p.id === Number(projectId));
        projects[projectIndex] = foundProject;
        localStorage.setItem("projects", JSON.stringify(projects));
      }

      setProject(foundProject);
      
      // Set first file as active by default
      if (foundProject.files && foundProject.files.length > 0) {
        setActiveFileId(foundProject.files[0].id);
        setActiveFile(foundProject.files[0]);
      }

      setLoading(false);
    } catch (err) {
      setError("Error loading project: " + err.message);
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Handle file selection from FileExplorer
   */
  const handleSelectFile = (fileId) => {
    if (project && project.files) {
      const file = project.files.find(f => f.id === fileId);
      if (file) {
        setActiveFileId(fileId);
        setActiveFile(file);
      }
    }
  };

  /**
   * Update active file content and persist to localStorage
   */
  const handleFileContentChange = (newContent) => {
    if (activeFile) {
      // Update active file state
      const updatedFile = { ...activeFile, content: newContent };
      setActiveFile(updatedFile);

      // Track unsaved file
      if (!unsavedFiles.includes(activeFileId)) {
        setUnsavedFiles(prev => [...prev, activeFileId]);
      }

      // Update project files
      const updatedProject = {
        ...project,
        files: project.files.map(f => f.id === activeFile.id ? updatedFile : f),
      };
      setProject(updatedProject);

      // Save to localStorage
      const projects = JSON.parse(localStorage.getItem("projects")) || [];
      const projectIndex = projects.findIndex(p => p.id === project.id);
      if (projectIndex !== -1) {
        projects[projectIndex] = updatedProject;
        localStorage.setItem("projects", JSON.stringify(projects));
        // Mark as saved after localStorage update
        setUnsavedFiles(prev => prev.filter(id => id !== activeFileId));
      }
    }
  };

  /**
   * Add new file to the project
   */
  const handleAddFile = () => {
    const fileName = prompt("Enter file name (e.g., utils.js):");
    if (!fileName) return;

    const newFile = {
      id: Date.now(),
      name: fileName,
      content: `// ${fileName}\n`,
    };

    const updatedProject = {
      ...project,
      files: [...project.files, newFile],
    };

    setProject(updatedProject);
    setActiveFileId(newFile.id);
    setActiveFile(newFile);

    // Save to localStorage
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const projectIndex = projects.findIndex(p => p.id === project.id);
    if (projectIndex !== -1) {
      projects[projectIndex] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  };

  /**
   * Delete file from the project
   */
  const handleDeleteFile = (fileId) => {
    if (project.files.length === 1) {
      alert("Cannot delete the last file");
      return;
    }

    const updatedProject = {
      ...project,
      files: project.files.filter(f => f.id !== fileId),
    };

    setProject(updatedProject);

    // Set next file as active if current file is deleted
    if (activeFileId === fileId) {
      setActiveFileId(updatedProject.files[0].id);
      setActiveFile(updatedProject.files[0]);
    }

    // Save to localStorage
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const projectIndex = projects.findIndex(p => p.id === project.id);
    if (projectIndex !== -1) {
      projects[projectIndex] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  };

  /**
   * Close file from tab without deleting it
   * Just removes it from view, doesn't delete the file
   */
  const handleCloseFileTab = (fileId) => {
    if (project.files.length === 1) {
      alert("Cannot close the last file");
      return;
    }

    // If closing the active file, switch to next file
    if (activeFileId === fileId) {
      const nextFile = project.files.find(f => f.id !== fileId);
      setActiveFileId(nextFile.id);
      setActiveFile(nextFile);
    }

    // Remove from unsaved files list
    setUnsavedFiles(prev => prev.filter(id => id !== fileId));
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col bg-zinc-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-lg">Loading project...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col bg-zinc-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950">
      <Navbar />

      <div className="flex-1 flex overflow-hidden pt-16">
        <Sidebar />

        {/* File Explorer and Editor Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <FileExplorer
            project={project}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
          />

          {/* Main Editor Area with AI Chat */}
          <div className="flex-1 flex flex-row overflow-hidden">
            {/* Code Editor - Full Width */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* File Tabs */}
              <FileTabs
                files={project?.files || []}
                activeFileId={activeFileId}
                onSelectFile={handleSelectFile}
                onCloseFile={handleCloseFileTab}
                unsavedFiles={unsavedFiles}
              />

              {/* Code Editor */}
              <CodeEditor
                activeFile={activeFile}
                project={project}
                onContentChange={handleFileContentChange}
                onOpenAI={() => setIsAIChatOpen(true)}
              />
            </div>
          </div>

          {/* AI Chat Widget (Floating Modal) */}
          {isAIChatOpen && (
            <div className="fixed bottom-6 right-6 w-96 h-96 rounded-lg shadow-2xl z-50 flex flex-col border border-zinc-700 overflow-hidden">
              <AIChat
                activeFile={activeFile}
                isOpen={isAIChatOpen}
                onClose={() => setIsAIChatOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;
