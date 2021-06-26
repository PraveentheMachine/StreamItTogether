//Our server. These are required imports and modules used by the server to setup the Rooms
const path = require("path");
const express = require("express"); //Importing Express Module
const http = require("http"); //used by Express under the hood to
const socketIO = require("socket.io");
const { emit } = require("process");
const formatVideo = require("./utils/videohelper");
const { userJoin, getCurrentUser, getRoomSize } = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.static(path.join(__dirname, "public")));
//If we are testing locally use 3000, if out streamed on Glitch use the environments port!
const PORT = 3000 || process.env.PORT;

//Create a Map which maps the host to their room iD
let hostMap = new Map();
//Create a Map with the Room and all of the Room users
let roomToUsersInRoomMap = new Map();

server.listen(PORT, () => console.log(`Server running on Port ${PORT}`));

//Run when a client connects
io.on("connection", (socket) => {
  //If we receive a joinRoom message from the client
  socket.on("joinRoom", ({ username, room, videoName, roomID }) => {
    //Check if the Room is a new room by determining its size
    let booleanCheck = getRoomSize(roomID) === 0 ? true : false;
    //Call method in utils/userjs which handles room logic
    const user = userJoin(socket.id, username, roomID, booleanCheck);
    //If we do not have the room with this ID, we must have a new room, therefore setup new room
    if (!roomToUsersInRoomMap.has(roomID)) {
      //Create a new users []
      let users = [];
      //add the current user to this room member array
      users.push(user);
      //Add it to the map which maps roomID to users in room
      roomToUsersInRoomMap.set(roomID, users);
    }
    //We have a room with this unique ID therefore we must add them to the room already created
    //this user is not the host 
    else {
      let addUsers = roomToUsersInRoomMap.get(roomID);
      addUsers.push(user);
      roomToUsersInRoomMap.set(roomID, addUsers);
    }
    //If this is a new Room we must make this user a Host as it is a room created by them 
    if (booleanCheck) {
      let host = user;
      hostMap.set(roomID, user);
      console.log("HOST CREATED with username:  " + host.username);
    }

    socket.join(user.roomID);
    socket.broadcast
      .to(user.roomID)
      .emit("message", `${username} has joined the chat`);
  });

  //todo fully implement this, default fix is to create a new room if it is exceeds >10000 users. 
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
  //If we receive a change Video request
  socket.on("changeVideo", (player, roomID, video) => {
    //Check if it is from the host
    if (player === hostMap.get(roomID).username) {
      io.to(roomID).emit("videoChange", `${video}`); 
    }
  });
  //When a video is stopped by the host, pause all videos
  socket.on("StoppedVideo", (player, roomID) => {
    if (player === hostMap.get(roomID).username) {
      io.to(roomID).emit(
        "pauseMessage",
        `${hostMap.get(roomID).username} has Stopped the Video`
      );
    }
  });

  socket.on("PlayingVideo", ({ username, player, roomID }) => {
    if (username === hostMap.get(roomID).username) {
      console.log(roomToUsersInRoomMap.get(roomID));
      console.log("WATCHING");
      io.to(roomID).emit("PlayngVideoMsg", { username, player });
    }
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});
