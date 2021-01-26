
const socket = io();
const btnPressed = document.getElementById("broo");
// const { userJoin, getCurrentUser, getRoomSize } = require("./utils/users"); ==> TIL you can't do this because frontend

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

function processUserName(nameOfVideo){
  console.log(nameOfVideo);
  let video = nameOfVideo.split("=")
  return video[1];
}


console.log("SHAMBLES");
console.log(processUserName(room));

console.log(room);

//Purely for testing at the moment
btnPressed.addEventListener("click", function () {
  //Join Chatroom
  //Getting message text
  const msg = `${counter} lets go`;
  counter++;
  outputMessage(message);
  socket.emit("chatMessage", msg);
});

function output(message) {
  const div = document.createElement("div");
  div.classList.add();
}

//Load the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
  player = new YT.Player("ytplayer", {
    height: "360",
    width: "640",
    videoId: processUserName(room),
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

socket.emit("joinRoom", { username, room });

socket.emit("hostPausedVideo", { username, room });

socket.on("message", (message) => {
  console.log(message);
});

socket.on("pauseMessage", (msg) => {
  console.log("MESSAGE RECEIVED");
  console.log(msg);
  console.log("SHOOOOW");
  player.pauseVideo();
});

//Socket for handling video messaging
socket.on("PlayngVideoMsg", (msg) => {
  if (player.getCurrentTime() !== msg.player.playerInfo.currentTime) {
    player.seekTo(msg.player.playerInfo.currentTime, true);
    player.playVideo();
  }
  player.playVideo();
});

function onPlayerReady(event) {
  //TLDR do something for this
}
function sendInformation(playerStatus) {
  if (playerStatus == -1) {
  } else if (playerStatus == 0) {
  } else if (playerStatus == 1) {
    //If we are playing a video synch it up
    socket.emit("PlayingVideo", { username, player });
  } else if (playerStatus == 2) {
    //We are pausing therefore emit, the server handles the fact we only really care about the host
    socket.emit("StoppedVideo", username);
  } else if (playerStatus == 3) {
    // color = "#AA00FF"; // buffering = purple
  } else if (playerStatus == 5) {
    // color = "#FF6DOO"; // video cued = orange
  }
}

//Function provided by the YouTube API which handles when the host is changing between states
function onPlayerStateChange(event) {
  sendInformation(event.data);
}

// onPlayerStateChange();

// onPlayerStateChange();

