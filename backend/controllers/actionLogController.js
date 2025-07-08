const ActionLog = require('../models/ActionLog');
const Project = require('../models/Project');

// GET last 20 actions for a specific project
const getRecentActions = async (req, res) => {
  const { projectId } = req.params;

  try {
    // ✅ Check if user is part of the project
    const project = await Project.findById(projectId);
    if (!project || !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    // ✅ Fetch last 20 logs from that project
    const actions = await ActionLog.find({ project: projectId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'name email')
      .populate('task', 'title');

    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecentActions };
