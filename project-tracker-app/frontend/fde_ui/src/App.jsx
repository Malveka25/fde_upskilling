import { useState, useEffect } from 'react';
import './App.css'

// IMPORTANT: This should be the public URL for your backend provided by GitHub Codespaces.
const API_URL = 'https://urban-space-giggle-q4vppxg7xjg2xwvw-8000.app.github.dev';

function App() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('To Do');
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({}); // Eg: { projectId: 'comment text' }

  // Function to fetch projects from the API
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      const data = await response.json();
      setProjects(data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError(`Failed to fetch projects. Is the backend running and its port set to Public? Error: ${error.message}`);
    }
  };

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchProjects();
  }, []); // The empty array means this effect runs only once on mount

  const handleCreateProject = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!newProjectName) return;

    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newProjectName, status: newProjectStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      // Refetch the projects list to show the new addition
      await fetchProjects();

      // Reset form fields
      setNewProjectName('');
      setNewProjectStatus('To Do');
    } catch (error) {
      console.error("Error creating project:", error);
      setError(`Failed to create project. Error: ${error.message}`);
    }
  };

  const handleCommentInputChange = (projectId, value) => {
    setCommentInputs(prev => ({ ...prev, [projectId]: value }));
  };

  const handleCreateComment = async (e, projectId) => {
    e.preventDefault();
    const commentText = commentInputs[projectId];
    if (!commentText || !commentText.trim()) return;

    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/comments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      await fetchProjects(); // Refetch all data to show the new comment
      setCommentInputs(prev => ({ ...prev, [projectId]: '' })); // Clear input

    } catch (error) {
      console.error("Error creating comment:", error);
      setError(`Failed to create comment. Error: ${error.message}`);
    }
  };

  const handleDeleteProject = async (projectId) => {
    // Add a confirmation dialog for better UX
    if (!window.confirm('Are you sure you want to delete this project and all its comments?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      await fetchProjects(); // Refetch to update UI

    } catch (error) {
      console.error("Error deleting project:", error);
      setError(`Failed to delete project. Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Project Tracker</h1>
      </header>
      <main>
        <div className="project-form">
          <h2>Add New Project</h2>
          <form onSubmit={handleCreateProject}>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
              required
            />
            <select value={newProjectStatus} onChange={(e) => setNewProjectStatus(e.target.value)}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button type="submit">Add Project</button>
          </form>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="project-list">
          <h2>Current Projects</h2>
          <ul>
            {projects.length > 0 ? (
              projects.map(project => (
                <li key={project.id}>
                  <div className="project-header">
                    <strong className="project-name">{project.name}</strong>
                    <div className="project-controls">
                      <em data-status={project.status}>{project.status}</em>
                      <button onClick={() => handleDeleteProject(project.id)} className="delete-btn" title="Delete Project">
                        &times;
                      </button>
                    </div>
                  </div>
                  <div className="comments-section">
                    {project.comments && project.comments.length > 0 && (
                      <ul className="comments-list">
                        {project.comments.map(comment => (
                          <li key={comment.id} className="comment-item">{comment.text}</li>
                        ))}
                      </ul>
                    )}
                    <form onSubmit={(e) => handleCreateComment(e, project.id)} className="comment-form">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[project.id] || ''}
                        onChange={(e) => handleCommentInputChange(project.id, e.target.value)}
                      />
                      <button type="submit">Post</button>
                    </form>
                  </div>
                </li>
              ))
            ) : (
              !error && <li>No projects found. Add one above!</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}

export default App
