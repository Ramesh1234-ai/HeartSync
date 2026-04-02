# ZecoAI File System Implementation Guide

## Overview

This is a complete file system implementation for the ZecoAI IDE using React.js. It allows users to create projects, manage multiple files within each project, and edit code with automatic persistence to localStorage.

---
## Project Structure
```
frontend/src/components/
├── pages/
│   └── project.jsx          # Projects list & management page
├── editor/
│   ├── Editor.jsx           # Main editor component (loads project)
│   ├── FileExplorer.jsx     # File tree sidebar (similar to VS Code)
│   └── CodeEditor.jsx       # Code editing area with terminal output
├── common/
│   ├── navbar.jsx           # Top navbar with user avatar
│   ├── sidebar.jsx          # Main app sidebar
│   └── projectcard.jsx      # Project card component
└── dashboard/
    └── DashboardLayout.jsx  # General dashboard
```
---
## Component Architecture
### 1. **Projects Component** (`project.jsx`)
**Purpose:** Main hub for project management
**Features:**
- Display all projects in a responsive grid
- Create new projects with initial file structure
- Edit project names
- Delete projects with confirmation
- Navigate to editor using `useNavigate()` and project ID
**State Management:**
```javascript
const [projects, setProjects] = useState([]);
const [showNewProjectModal, setShowNewProjectModal] = useState(false);
const [projectName, setProjectName] = useState("");
```
**Key Functions:**
- `createProject()` - Creates new project with default `index.js` file
- `handleOpen(project)` - Navigates to `/editor/:id` 
- `handleEdit(project)` - Renames project
- `handleDelete(projectId)` - Removes project from list
- `handleShare(project)` - Placeholder for sharing

---

### 2. **Editor Component** (`editor/Editor.jsx`)
**Purpose:** Main editor page with file system management

**Features:**
- Load project from localStorage using `useParams()`
- Initialize files if none exist
- Manage active file state
- Auto-save changes to localStorage
- Add/delete files

**State Management:**
```javascript
const { id: projectId } = useParams();
const [project, setProject] = useState(null);
const [activeFileId, setActiveFileId] = useState(null);
const [activeFile, setActiveFile] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Key Functions:**
- `useEffect()` - Loads project from localStorage
- `handleSelectFile(fileId)` - Updates active file
- `handleFileContentChange(newContent)` - Auto-saves to localStorage
- `handleAddFile()` - Creates new file with prompt
- `handleDeleteFile(fileId)` - Deletes file with confirmation

**Data Flow:**
```
url param (:id) 
    ↓
useParams() 
    ↓
localStorage.getItem("projects") 
    ↓
find project by ID
    ↓
set activeFile to first file
    ↓
render FileExplorer + CodeEditor
```

---

### 3. **FileExplorer Component** (`editor/FileExplorer.jsx`)
**Purpose:** VS Code-like file tree sidebar

**Features:**
- Display list of files for current project
- Click to select/open file
- Highlight active file
- Add new file button
- Delete file with hover action
- Show file stats (count, last modified)

**Props:**
```javascript
FileExplorer({
  project,           // Current project object
  activeFileId,      // ID of currently selected file
  onSelectFile,      // Callback when file is clicked
  onAddFile,         // Callback to create new file
  onDeleteFile,      // Callback to delete file
})
```

**Styling:**
- Dark theme (zinc-900)
- Active file: indigo highlight
- Hover effects and transitions
- File icons using lucide-react

---

### 4. **CodeEditor Component** (`editor/CodeEditor.jsx`)
**Purpose:** Main code editing area

**Features:**
- Display file content in textarea
- Real-time editing
- Copy button (clipboard)
- Save button (feedback)
- Run button (simulated execution)
- Terminal/output section below editor

**Props:**
```javascript
CodeEditor({
  activeFile,        // Current file object
  project,           // Current project object
  onContentChange,   // Callback when code is edited
})
```

**Auto-save Behavior:**
```javascript
const handleContentChange = (e) => {
  const newContent = e.target.value;
  setEditorContent(newContent);
  setIsSaved(false);
  onContentChange(newContent);  // Passes to Editor component
  setIsSaved(true);             // Local feedback
};
```

---

## Data Structures

### Project Object
```javascript
{
  id: "1711324800000",          // Unique identifier (timestamp string)
  name: "My First App",         // Project name
  files: [                      // Array of files
    {
      id: 1711324800001,        // Unique file ID
      name: "index.js",         // File name with extension
      content: "// Code here..." // File content
    },
    {
      id: 1711324800002,
      name: "utils.js",
      content: "function sum(a, b) { return a + b; }"
    }
  ],
  language: "JavaScript",       // Primary language
  lastModified: "2024-03-30...", // ISO timestamp
  createdAt: "2024-03-30..."    // ISO timestamp
}
```

### File Object
```javascript
{
  id: 1711324800001,
  name: "index.js",
  content: "// Your code here...\n"
}
```

---

## localStorage Structure

**Key:** `"projects"`  
**Value:** JSON stringified array of projects

```javascript
// Get all projects
const projects = JSON.parse(localStorage.getItem("projects")) || [];

// Find specific project
const project = projects.find(p => p.id === "1711324800000");

// Update project
projects[projectIndex] = updatedProject;
localStorage.setItem("projects", JSON.stringify(projects));
```

---

## User Flow

### 1. Creating a Project
```
Projects Page 
  → Click "New Project"
  → Enter project name
  → Click "Create"
  → Default project structure created:
     * Project ID: timestamp
     * Default file: index.js
     * Initial content: Welcome comment
```

### 2. Opening a Project
```
Projects Page 
  → Click "Open" on project card
  → Navigate to /editor/:id
  → Editor component loads project
  → First file set as active
  → FileExplorer shows all files
  → CodeEditor displays active file
```

### 3. Editing a File
```
CodeEditor textarea 
  → User types code
  → onChange event fires
  → onContentChange() callback
  → Editor.jsx updates project state
  → localStorage.setItem() saves changes
  → Changes persist across browser sessions
```

### 4. Switching Files
```
FileExplorer 
  → Click on file name
  → onSelectFile() callback
  → Editor.jsx updates activeFileId
  → CodeEditor re-renders with new content
```

### 5. Adding a New File
```
FileExplorer "New File" button 
  → User enters filename (prompt)
  → onAddFile() callback in Editor
  → New file object created with unique ID
  → Added to project.files array
  → Set as active file
  → Saved to localStorage
```

### 6. Deleting a File
```
FileExplorer file hover 
  → Click delete icon
  → Confirmation dialog
  → File removed from project.files
  → If active file deleted:
     * Next file becomes active
  → Project updated in localStorage
```

---

## Key Implementation Details

### 1. Auto-Save Mechanism
Every time a user edits code, it automatically saves to localStorage:

```javascript
// In Editor.jsx
const handleFileContentChange = (newContent) => {
  // Update local state
  const updatedFile = { ...activeFile, content: newContent };
  setActiveFile(updatedFile);
  
  // Update project
  const updatedProject = {
    ...project,
    files: project.files.map(f => f.id === activeFile.id ? updatedFile : f),
  };
  setProject(updatedProject);
  
  // Persist to localStorage
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const projectIndex = projects.findIndex(p => p.id === project.id);
  if (projectIndex !== -1) {
    projects[projectIndex] = updatedProject;
    localStorage.setItem("projects", JSON.stringify(projects));
  }
};
```

### 2. File Selection Logic
```javascript
// Default: First file opens automatically
useEffect(() => {
  if (foundProject.files && foundProject.files.length > 0) {
    setActiveFileId(foundProject.files[0].id);
    setActiveFile(foundProject.files[0]);
  }
}, [projectId]);

// User click: Select specific file
const handleSelectFile = (fileId) => {
  const file = project.files.find(f => f.id === fileId);
  if (file) {
    setActiveFileId(fileId);
    setActiveFile(file);
  }
};
```

### 3. Navigation Integration
```javascript
// In project.jsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleOpen = (project) => {
  navigate(`/editor/${project.id}`);
};

// In App.jsx
<Route path="/editor/:id" element={<Editor />} />
```

---

## Routing Setup

```javascript
// App.jsx
<Routes>
  <Route path="/projects" element={<Projects />} />
  <Route path="/editor/:id" element={<Editor />} />
</Routes>
```

---

## Styling Approach

- **Dark Theme:** Zinc color palette (zinc-900, zinc-800, etc.)
- **Accent Color:** Indigo (indigo-600, indigo-400)
- **Functional Colors:**
  - Success: Green (green-400, green-600)
  - Delete: Red (red-400)
  - Info: Cyan (cyan-400)
- **Icons:** lucide-react library
- **Responsive:** Tailwind CSS grid and flexbox

---

## Error Handling

```javascript
// In Editor.jsx
const [error, setError] = useState(null);

useEffect(() => {
  try {
    // Load project logic
  } catch (err) {
    setError("Error loading project: " + err.message);
  }
}, [projectId]);

// Render error state
if (error) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-red-400 text-lg">{error}</div>
    </div>
  );
}
```

---

## Future Enhancements

1. **File Renaming:** Allow users to rename files
2. **Folder Structure:** Organize files in folders
3. **Syntax Highlighting:** Use Monaco Editor or CodeMirror
4. **Themes:** Multiple color themes
5. **File Types:** Support for CSS, HTML, JSON, etc.
6. **Collaboration:** Real-time file sharing
7. **Version Control:** Git integration
8. **Export:** Download project as ZIP
9. **Terminal Integration:** Actual code execution
10. **AI Assistance:** ZecoAI code suggestions

---

## Testing Checklist

- [ ] Create new project
- [ ] View project list
- [ ] Open project in editor
- [ ] Create new file
- [ ] Edit file content
- [ ] Switch between files
- [ ] Delete file (non-last file)
- [ ] Edit project name
- [ ] Delete project
- [ ] Verify localStorage persistence
- [ ] Refresh page and check data loads
- [ ] Test with multiple projects

---

## Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "lucide-react": "^0.x"
}
```

---

## Notes

1. **Project IDs:** Using timestamp (`Date.now().toString()`) for unique IDs
2. **File IDs:** Using timestamp for unique file IDs within projects
3. **Storage:** Limited to localStorage (5-10MB per browser)
4. **Scalability:** Consider moving to backend for real applications
5. **Security:** No authentication needed for demo; add in production

---

## Support

For implementation help or questions, refer to comments in each component.

