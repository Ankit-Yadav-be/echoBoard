const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const actionRoutes = require("./routes/actionRoutes");
const projectRoutes = require("./routes/projectRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Background worker
require("./utils/reminderWorker");

dotenv.config();
connectDB();

const app = express();

// ✅ Allowed frontend domains
const allowedOrigins = ["https://echo-board-mu.vercel.app"];

// ✅ Dynamic CORS middleware for Express
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Handle preflight requests for all routes
app.options("*", cors());

// ✅ Express middlewares
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/task/:taskId/comments", commentRoutes);

// ✅ Base route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Create HTTP server and initialize Socket.IO
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket.IO - Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("joinTask", (taskId) => {
    socket.join(taskId);
    console.log(`📥 Socket ${socket.id} joined task room: ${taskId}`);
  });

  socket.on("sendComment", ({ taskId, comment }) => {
    console.log(`💬 New comment on task ${taskId}:`, comment);
    io.to(taskId).emit("newComment", comment);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ✅ Attach io instance to app
app.set("io", io);

// ✅ Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
