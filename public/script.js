const socket = io({
  transports: ["websocket", "polling"],
  timeout: 20000,
  forceNew: true,
});

// Connection status handling
socket.on("connect", () => {
  console.log("✅ Connected to MinimalChat server");
});

socket.on("connect_error", (error) => {
  console.error("❌ Connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("👋 Disconnected:", reason);
});

// DOM elements
const messagesDiv = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");

let currentUsername = "";

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Create and append message
function appendMessage(msg) {
  const messageDiv = document.createElement("div");
  const isOwnMessage = msg.username === currentUsername;

  messageDiv.className = `message ${isOwnMessage ? "own" : "other"}`;

  messageDiv.innerHTML = `
    <div class="message-info">
      <span class="username">${msg.username}</span>
      <span class="timestamp">${formatTime(msg.timestamp)}</span>
    </div>
    <div class="message-bubble">${msg.message}</div>
  `;

  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Handle chat history
socket.on("chat history", (messages) => {
  console.log("📚 Loading chat history:", messages.length, "messages");
  messagesDiv.innerHTML = "";
  messages.forEach(appendMessage);
});

// Handle new message
socket.on("chat message", (msg) => {
  console.log("📨 New message:", msg.username, ":", msg.message);
  appendMessage(msg);
});

// Handle form submission
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();

  if (!username || !message) {
    alert("Please enter both your name and a message");
    return;
  }

  // Store username for message styling
  currentUsername = username;

  console.log("📤 Sending message:", { username, message });

  // Send message via Socket.IO
  socket.emit("chat message", { username, message });

  // Clear message input and focus
  messageInput.value = "";
  messageInput.focus();
});

// Auto-focus on message input when page loads
document.addEventListener("DOMContentLoaded", () => {
  messageInput.focus();
});
