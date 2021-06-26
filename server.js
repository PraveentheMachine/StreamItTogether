//Entry point
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
const PORT = 3000 || process.env.PORT;

let hostMap = new Map();
let roomToUsersInRoomMap = new Map();

server.listen(PORT, () => console.log(`Server running on Port ${PORT}`));

//Run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room, videoName, roomID }) => {
    let booleanCheck = getRoomSize(roomID) === 0 ? true : false;
    const user = userJoin(socket.id, username, roomID, booleanCheck);
    if(!roomToUsersInRoomMap.has(roomID)){
      let users = [];
      users.push(user);
      console.log("ADDING to a new room " + user);
      roomToUsersInRoomMap.set(roomID,users);
    }
    else{
      let addUsers = roomToUsersInRoomMap.get(roomID);
      addUsers.push(user);
      console.log(roomToUsersInRoomMap);
      console.log("ADDING to a old room " + user);
      roomToUsersInRoomMap.set(roomID,addUsers);
      console.log(roomToUsersInRoomMap);
    }
    if (booleanCheck) {
     let host = user;
      hostMap.set(roomID, user);
      console.log("HOST CREATED with username:  " + host.username);
    }
    // socket.emit("message", `Welcome to ${host.username}'s Room`);
    socket.join(user.roomID);
    socket.broadcast.to(user.roomID).emit("message", `${username} has joined the chat`);
  });


  //todo fix this e.g fully implement 
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
  socket.on("changeVideo",(player,roomID,video) =>{
    if(player === hostMap.get(roomID).username){
      console.log("Change Video message being sent");
      io.to(roomID).emit(
        "videoChange",
        `${video}`
      ) //all of the clients except
  }
});
  //When a video is stopped by the host, pause all videos 
  socket.on("StoppedVideo", (player,roomID) => {


    if(player === hostMap.get(roomID).username){
      console.log("PAUSE MESSAGE BEING SENT");
      console.log(roomToUsersInRoomMap.get(roomID));
    // if (player === host.username) {
      io.to(roomID).emit(
        "pauseMessage",
        `${hostMap.get(roomID).username} has Stopped the Video`
      ); //all of the clients except
   // }
  }
    // io.emit("pauseMessage", formatVideo(player, player.playerInfo.currentTime));
  });

  socket.on("PlayingVideo", ({ username, player,roomID }) => {
   
    // console.log(roomID);
    // console.log(player.username);ç
    // console.log("Playing Video");
    // console.log(username);
    if(username === hostMap.get(roomID).username){
      console.log(roomToUsersInRoomMap.get(roomID));
      console.log("WATCHING");
      // console.log(`${host.username} is playing`);
      //Message sending the information regarding player 
      io.to(roomID).emit("PlayngVideoMsg", { username, player}); 
    }
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});
