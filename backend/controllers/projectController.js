const Project = require("../models/Project");
const User = require("../models/User");

// ✅ Create a new project
const createProject = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Project name is required" });

  try {
    const project = await Project.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id], // Add creator as default member
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get all projects where current user is a member
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
    })
      .select("name createdAt members")
      .populate("members", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add another user to project
const addUserToProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only the project creator can add members" });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User already in project" });
    }

    project.members.push(userId);
    await project.save();

    const updatedProject = await Project.findById(projectId).populate("members", "name email");
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Remove a user from the project
const removeUserFromProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only the project creator can remove members" });
    }

    // Prevent removing creator
    if (project.createdBy.equals(userId)) {
      return res.status(400).json({ message: "Cannot remove the project creator" });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== userId
    );
    await project.save();

    const updatedProject = await Project.findById(projectId).populate("members", "name email");
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all members of a project
const getProjectMembers = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate(
      "members",
      "name email"
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = req.user._id.toString();
    const isMember = project.members.some((m) => m._id.toString() === userId);
    const isCreator = project.createdBy.toString() === userId;

    if (!isMember && !isCreator) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    res.json(project.members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  addUserToProject,
  removeUserFromProject, // ✅ added
  getProjectMembers,
};
