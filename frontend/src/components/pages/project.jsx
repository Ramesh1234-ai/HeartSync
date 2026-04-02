import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileCode } from "lucide-react";
import Navbar from "../common/navbar";
import Sidebar from "../common/sidebar";
import ProjectCard from "../common/projectcard";

/**
 * Projects Component
 * Main page for browsing, creating, and opening projects
 * Each project contains a file system managed in the Editor component
 */
function Projects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [projectName, setProjectName] = useState("");

    /**
     * Load projects from localStorage on component mount
     */
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("projects")) || [];
        setProjects(saved);
    }, []);

    /**
     * Create a new project with initial file structure
     */
    const createProject = () => {
        if (!projectName.trim()) return;
        
        const newProject = {
            id: Date.now().toString(),
            name: projectName,
            files: [
                {
                    id: Date.now(),
                    name: "index.js",
                    content: `// ${projectName}\n// Welcome to ZecoAI\n\nfunction main() {\n  console.log('Hello from ${projectName}');\n}\n\nmain();`,
                },
            ],
            language: "JavaScript",
            lastModified: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };
        
        const updated = [...projects, newProject];
        setProjects(updated);
        localStorage.setItem("projects", JSON.stringify(updated));
        setProjectName("");
        setShowNewProjectModal(false);
    };

    /**
     * Delete a project from the list
     */
    const handleDelete = (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            const updated = projects.filter(p => p.id !== projectId);
            setProjects(updated);
            localStorage.setItem("projects", JSON.stringify(updated));
        }
    };

    /**
     * Open project in the editor
     * Navigate to /editor/:id route where the file system is managed
     */
    const handleOpen = (project) => {
        navigate(`/editor/${project.id}`);
    };

    /**
     * Edit project name
     */
    const handleEdit = (project) => {
        const editedName = prompt("Edit project name:", project.name);
        if (editedName && editedName.trim()) {
            const updated = projects.map(p => 
                p.id === project.id 
                    ? { ...p, name: editedName, lastModified: new Date().toISOString() } 
                    : p
            );
            setProjects(updated);
            localStorage.setItem("projects", JSON.stringify(updated));
            setProjects(updated);
        }
    };

    /**
     * Share project (placeholder for future implementation)
     */
    const handleShare = (project) => {
        alert(`Share functionality for "${project.name}" coming soon!`);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-zinc-950">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden pt-16">
                {/* Sidebar */}
                <Sidebar />
                
                {/* Projects Container */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="border-b border-zinc-800 px-8 py-6 bg-zinc-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Projects</h1>
                                <p className="text-white/50 text-sm mt-1">
                                    {projects.length} project{projects.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNewProjectModal(true)}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                <Plus size={20} />
                                New Project
                            </button>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {projects.length === 0 ? (
                            // Empty State
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="text-white/30 mb-4">
                                    <FileCode size={64} />
                                </div>
                                <h2 className="text-2xl font-semibold text-white mb-2">
                                    No projects yet
                                </h2>
                                <p className="text-white/50 mb-6 max-w-md">
                                    Get started by creating your first project. Build amazing applications with ZecoAI!
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowNewProjectModal(true)}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                                    >
                                        <Plus size={20} />
                                        Create New Project
                                    </button>
                                    <button
                                        onClick={() => {
                                            const sampleProject = {
                                                id: Date.now().toString(),
                                                name: "Sample Project",
                                                files: [
                                                    {
                                                        id: Date.now(),
                                                        name: "index.js",
                                                        content: `// Sample Project\n// This is a test project\n\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("ZecoAI"));\n`,
                                                    },
                                                    {
                                                        id: Date.now() + 1,
                                                        name: "utils.js",
                                                        content: `// Utility functions\n\nexport function add(a, b) {\n  return a + b;\n}\n\nexport function subtract(a, b) {\n  return a - b;\n}\n`,
                                                    }
                                                ],
                                                language: "JavaScript",
                                                lastModified: new Date().toISOString(),
                                                createdAt: new Date().toISOString(),
                                            };
                                            const updated = [sampleProject];
                                            setProjects(updated);
                                            localStorage.setItem("projects", JSON.stringify(updated));
                                        }}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                                    >
                                        Create Sample Project
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Projects Grid
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(project => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onOpen={handleOpen}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onShare={handleShare}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create New Project Modal */}
            {showNewProjectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 w-96 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
                        
                        {/* Input Field */}
                        <input
                            type="text"
                            placeholder="Project name (e.g., My Awesome App)"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && createProject()}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 mb-4"
                            autoFocus
                        />

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowNewProjectModal(false);
                                    setProjectName("");
                                }}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createProject}
                                disabled={!projectName.trim()}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projects;
