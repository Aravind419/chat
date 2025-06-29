const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB connection
mongoose.connect(
  "mongodb+srv://Aravind:Aravind%402041@cluster0.ykz5b.mongodb.net/chatapp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const groupSchema = new mongoose.Schema({
  name: String,
});

const Group = mongoose.model("Group", groupSchema);

const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

app.use(express.static(path.join(__dirname, "public")));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", async (socket) => {
  // Send list of groups
  const groups = await Group.find();
  socket.emit("group list", groups);

  // Join a group
  socket.on("join group", async (groupId) => {
    socket.join(groupId);
    // Send last 20 messages for this group
    const messages = await Message.find({ group: groupId })
      .sort({ createdAt: -1 })
      .limit(20)
      .sort({ createdAt: 1 })
      .populate("group");
    socket.emit("chat history", messages);
  });

  // Create a new group
  socket.on("create group", async (groupName) => {
    const group = new Group({ name: groupName });
    await group.save();
    io.emit("group list", await Group.find());
  });

  // Handle chat message
  socket.on("chat message", async (data) => {
    const msg = new Message({
      username: data.username,
      message: data.message,
      group: data.groupId,
    });
    await msg.save();
    io.to(data.groupId).emit("chat message", msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
