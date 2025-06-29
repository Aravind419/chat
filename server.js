require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/chat_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Message Schema (matching PRD requirements)
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API Endpoints (optional - for future expansion)
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Socket.IO connection handling
io.on("connection", async (socket) => {
  console.log("👤 User connected:", socket.id);

  try {
    // Send last 50 messages to new user
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .sort({ timestamp: 1 });
    socket.emit("chat history", messages);

    // Handle new message
    socket.on("chat message", async (data) => {
      console.log("📨 New message from:", data.username);

      const msg = new Message({
        username: data.username,
        message: data.message,
        timestamp: new Date(),
      });

      await msg.save();

      // Broadcast to all connected users
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("👋 User disconnected:", socket.id);
    });
  } catch (error) {
    console.error("❌ Socket error:", error);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 MinimalChat server running on http://localhost:${PORT}`);
  console.log(
    `📊 MongoDB Atlas: ${
      process.env.MONGODB_URI ? "Connected" : "Using local fallback"
    }`
  );
});
