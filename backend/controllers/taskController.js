const Task = require("../models/Task");
const User = require("../models/User");
const Project = require("../models/Project");
const ActionLog = require("../models/ActionLog");

//  Create Task with SmartAssign and Deadline
const createTask = async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    assignedTo,
    project,
    githubLink,
    youtubeLink,
    databaseLink,
    deadline, 
  } = req.body;

  try {
    const forbiddenTitles = ['Todo', 'In Progress', 'Done'];
    if (forbiddenTitles.includes(title)) {
      return res.status(400).json({ message: 'Task title cannot match column names' });
    }

    const existingTask = await Task.findOne({ title, project });
    if (existingTask) {
      return res.status(400).json({ message: 'Task title must be unique in project' });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc || !projectDoc.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not a member of this project' });
    }

    //  Smart Assign
    let assignedUserId = assignedTo;
    if (!assignedTo) {
      const projectTasks = await Task.find({ project });

      const taskCounts = {};
      for (let t of projectTasks) {
        const uid = t.assignedTo?.toString();
        if (uid) taskCounts[uid] = (taskCounts[uid] || 0) + 1;
      }

      let leastLoadedUser = null;
      let minTasks = Infinity;
      for (let memberId of projectDoc.members) {
        const count = taskCounts[memberId.toString()] || 0;
        if (count < minTasks) {
          minTasks = count;
          leastLoadedUser = memberId;
        }
      }

      assignedUserId = leastLoadedUser;
    }

    //  Create task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo: assignedUserId,
      creator: req.user._id,
      project,
      githubLink,
      youtubeLink,
      databaseLink,
      deadline,
    });

    await ActionLog.create({
      actionType: 'create',
      task: task._id,
      user: req.user._id,
      project,
      description: `${req.user.name} created task "${task.title}"`,
    });

    const io = req.app.get('io');
    const populatedTask = await task.populate('assignedTo', 'name email');
    io.emit('taskCreated', populatedTask);

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get All Tasks
const getAllTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project || !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email');

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update Task (with deadline support)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('assignedTo', 'name email');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    await ActionLog.create({
      actionType: 'update',
      task: task._id,
      user: req.user._id,
      project: task.project,
      description: `${req.user.name} updated task "${task.title}"`,
    });

    const io = req.app.get('io');
    io.emit('taskUpdated', task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await ActionLog.create({
      actionType: 'delete',
      task: task._id,
      user: req.user._id,
      project: task.project,
      description: `${req.user.name} deleted task "${task.title}"`,
    });

    const io = req.app.get('io');
    io.emit('taskDeleted', { taskId: task._id });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
