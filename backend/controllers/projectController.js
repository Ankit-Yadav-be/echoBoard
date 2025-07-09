const Project = require("../models/Project");
const User = require("../models/User");

// ✅ Create a new project with admin set to creator
const createProject = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Project name is required" });

  try {
    const project = await Project.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id],
      admins: [req.user._id], // ✅ creator becomes admin
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all projects where user is a member
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .select("name createdAt members admins")
      .populate("members", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add user to project — only admins allowed
const addUserToProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isAdmin = project.admins.some((adminId) =>
      adminId.equals(req.user._id)
    );
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can add members" });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User already in project" });
    }

    project.members.push(userId);
    await project.save();

    const updated = await Project.findById(projectId).populate("members", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Remove user from project — only admins allowed
const removeUserFromProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isAdmin = project.admins.some((adminId) =>
      adminId.equals(req.user._id)
    );
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can remove members" });
    }

    // Prevent removing creator
    if (project.createdBy.equals(userId)) {
      return res.status(400).json({ message: "Cannot remove the project creator" });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== userId
    );

    // Also remove from admins if needed
    project.admins = project.admins.filter(
      (id) => id.toString() !== userId
    );

    await project.save();

    const updated = await Project.findById(projectId).populate("members", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get project members
const getProjectMembers = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate("members", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = req.user._id.toString();
    const isMember = project.members.some((m) => m._id.toString() === userId);

    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this project" });
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
  removeUserFromProject,
  getProjectMembers,
};
