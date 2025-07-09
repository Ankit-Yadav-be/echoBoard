import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // 🔁 Fetch user's projects
  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/my');
      setProjects(res.data);

      // Select first project by default if none selected
      if (res.data.length && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  // ✅ Fetch projects if token is available
  useEffect(() => {
    if (token) {
      fetchProjects();
    } else {
      setProjects([]);
      setSelectedProject(null);
    }
  }, [token]);

  // ✅ Listen to login/logout from other tabs or programmatic login
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setToken(newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ Also listen to manual login (same tab)
  useEffect(() => {
    const onLogin = () => {
      const t = localStorage.getItem('token');
      setToken(t);
    };
    window.addEventListener('project-login', onLogin);
    return () => window.removeEventListener('project-login', onLogin);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
