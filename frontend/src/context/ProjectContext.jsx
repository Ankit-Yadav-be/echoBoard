import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects/my");
      console.log(res.data);
      setProjects(res.data);

      if (res.data.length && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
    } else {
      setProjects([]);
      setSelectedProject(null);
    }
  }, [isLoggedIn]);

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
