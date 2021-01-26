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

server.listen(PORT, () => console.log(`Server running on Port ${PORT}`));

//Run when a client connects
let host = null;
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room, videoName }) => {
    console.log(videoName);
    let booleanCheck = getRoomSize(videoName) === 0 ? true : false;
    const user = userJoin(socket.id, username, videoName, booleanCheck);
    if (booleanCheck) {
      host = user;
      console.log("HOST CREATED with username:  " + host.username);
    }
    socket.emit("message", `Welcome to ${host.username}'s Room`);
    socket.join(user.room);
    socket.broadcast.to(user.room).emit("message", `${username} has joined the chat`);
  });


  //todo fix this e.g fully implement 
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the hcat");
  });

  //When a video is stopped by the host, pause all videos 
  socket.on("StoppedVideo", (player) => {

    //Need to ensure there is no way of distinguishing between users with the same name
    //implement in USERS class 
    if (player === host.username) {
      io.to(host.room).emit(
        "pauseMessage",
        `${host.username} has Stopped the Video`
      ); //all of the clients except
    }
    // io.emit("pauseMessage", formatVideo(player, player.playerInfo.currentTime));
  });

  socket.on("PlayingVideo", ({ username, player }) => {
   

    if (username === host.username) {
      console.log(`${host} is playing`);
      //Message sending the information regarding player 
      io.to(host.room).emit("PlayngVideoMsg", { username, player }); 
    }
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});
