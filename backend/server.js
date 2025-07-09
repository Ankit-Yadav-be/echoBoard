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

require("./utils/reminderWorker");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = ["https://echo-board-mu.vercel.app"];

// ✅ Apply CORS middleware before any routes
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Enable preflight across all routes
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", commentRoutes); // Correct: no colon param in app.use()

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ HTTP + WebSocket setup
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: allowedOrigins[0], // Must be a string, not an array
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("joinTask", (taskId) => {
    socket.join(taskId);
    console.log(`Socket ${socket.id} joined room for task: ${taskId}`);
  });

  socket.on("sendComment", ({ taskId, comment }) => {
    console.log(`New comment on task ${taskId}:`, comment);
    io.to(taskId).emit("newComment", comment);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ✅ Make io accessible in controllers (optional)
app.set("io", io);

// ✅ Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
