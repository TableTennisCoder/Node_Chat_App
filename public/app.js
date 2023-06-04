const messageTypes = {
  LEFT: "left",
  RIGHT: "right",
  LOGIN: "login",
};

// Chat Stuff
const chatWindow = document.getElementById("chat");
const messagesList = document.getElementById("messagesList");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Login Stuff
let username = "";
const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");
const loginWindow = document.getElementById("login");

// Handle socket in Frontend
var socket = io();

// What we gonna do when we receive the message
socket.on("message", (message) => {
  console.log(message);
  if (message.type !== messageTypes.LOGIN) {
    message.author === username
      ? (message.type = messageTypes.RIGHT)
      : (message.type = messageTypes.LEFT);
  }

  messages.push(message);
  displayMessage();
});

const messages = [];

// Returns the HTML-String for our messages
const createMessageHTML = (message) => {
  if (message.type === messageTypes.LOGIN) {
    return `
            <p class="secondary-text text-center mb-2"> ${message.author} has joined the chat...</p>
        `;
  }

  return `
        <div class="message ${
          message.type === messageTypes.LEFT ? "message-left" : "message-right"
        }">
            <div class="message-details flex">
            <p class="message-author">${
              message.type === messageTypes.RIGHT ? "" : message.author
            }</p>
            <p class="message-date">${message.date}</p>
            </div>
            <p class="message-content">${message.content}</p>
        </div>
    `;
};

// Function to display th emessages in our messagesList
const displayMessage = () => {
  const messageHTML = messages
    .map((message) => createMessageHTML(message))
    .join("");
  messagesList.innerHTML = messageHTML;
  //   console.log(messageHTML);
};

// If we click 'login'
loginBtn.addEventListener("click", (e) => {
  // Prevent default of a form
  e.preventDefault();

  // Set the username and create logged in message
  if (!usernameInput.value) return alert("Must supply a username");

  username = usernameInput.value;

  sendMessage({ author: username, type: messageTypes.LOGIN });

  // Hide login and show chat window
  chatWindow.classList.remove("hidden");
  loginWindow.classList.add("hidden");
});

// If we click 'send'
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!messageInput.value) return alert("Must send a message");

  const today = new Date();
  const date = Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(today);
  const time = Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(today);

  const message = {
    author: username,
    date: date + " - " + time,
    content: messageInput.value,
  };

  sendMessage(message);

  messageInput.value = "";
});

// Send our message Object to the server
const sendMessage = (message) => {
  socket.emit("message", message);
};
