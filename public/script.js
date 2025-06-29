const socket = io();

const messagesDiv = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const groupList = document.getElementById("group-list");
const currentGroupHeader = document.getElementById("current-group");
const createGroupForm = document.getElementById("create-group-form");
const newGroupNameInput = document.getElementById("new-group-name");

let currentGroupId = null;
let username = "";

function renderGroups(groups) {
  groupList.innerHTML = "";
  groups.forEach((group) => {
    const li = document.createElement("li");
    li.textContent = group.name;
    li.dataset.id = group._id;
    if (group._id === currentGroupId) li.classList.add("active");
    li.onclick = () => selectGroup(group._id, group.name);
    groupList.appendChild(li);
  });
}

function selectGroup(groupId, groupName) {
  currentGroupId = groupId;
  currentGroupHeader.textContent = groupName;
  Array.from(groupList.children).forEach((li) => {
    li.classList.toggle("active", li.dataset.id === groupId);
  });
  messagesDiv.innerHTML = "";
  socket.emit("join group", groupId);
}

function appendMessage(msg) {
  const div = document.createElement("div");
  const isMe = msg.username === usernameInput.value.trim();
  div.classList.add("msg", isMe ? "me" : "other");
  div.innerHTML = `<span class="user">${msg.username}</span><span class="text">${msg.message}</span>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

socket.on("group list", (groups) => {
  renderGroups(groups);
});

socket.on("chat history", (msgs) => {
  messagesDiv.innerHTML = "";
  msgs.forEach(appendMessage);
});

socket.on("chat message", (msg) => {
  appendMessage(msg);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  username = usernameInput.value.trim();
  const message = messageInput.value.trim();
  if (!username || !message || !currentGroupId) return;
  socket.emit("chat message", { username, message, groupId: currentGroupId });
  messageInput.value = "";
  messageInput.focus();
});

createGroupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const groupName = newGroupNameInput.value.trim();
  if (!groupName) return;
  socket.emit("create group", groupName);
  newGroupNameInput.value = "";
});
