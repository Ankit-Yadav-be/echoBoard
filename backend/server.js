const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const actionRoutes = require("./routes/actionRoutes");
const projectRoutes = require("./routes/projectRoutes");
const commentRoutes = require("./routes/commentRoutes");

require('./utils/reminderWorker');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/task/:taskId/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Create HTTP server and bind Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Use specific origin in production
    methods: ["GET", "POST"]
  }
});

//  Socket.IO logic
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // User joins a task room
  socket.on("joinTask", (taskId) => {
    socket.join(taskId);
    console.log(` Socket ${socket.id} joined room for task: ${taskId}`);
  });

  // User sends a new comment
  socket.on("sendComment", ({ taskId, comment }) => {
    console.log(` New comment on task ${taskId}:`, comment);
    // Broadcast to all sockets in that task room
    io.to(taskId).emit("newComment", comment);
  });

  socket.on("disconnect", () => {
    console.log(` Client disconnected: ${socket.id}`);
  });
});

//  Export io for controller use
app.set("io", io);

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
