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

// ✅ Allow preflight
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", commentRoutes); // ✅ Clean and safe

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ HTTP & Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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

app.set("io", io);

// ✅ Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
