import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // track token as state

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/my');
      setProjects(res.data);

      if (res.data.length && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    } else {
      setProjects([]);
      setSelectedProject(null);
    }
  }, [token]);

  // listen to login/logout actions globally
  useEffect(() => {
    const onStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
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
