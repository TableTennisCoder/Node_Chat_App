const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

// Serve the public directory
app.use(express.static(path.join(__dirname, "public")));

//If someone makes a GET-Request to our URL (localjost:3000) send them our index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, +"public/index.html"));
});

// Every time a user connects to our webpage -> Connection Event
io.on("connection", (socket) => {
  console.log("a user has connetced");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (message) => {
    console.log("message", message);
    io.emit("message", message);
  });
});

http.listen(3000, () => {
  console.log("listening on port 3000");
});
