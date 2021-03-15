
const socket = io();
const btnPressed = document.getElementById("broo");
let textFieldVideo= document.querySelector('.added');
let titleName = document.querySelector("title");
let userNames = [];
const element = document.querySelector('form');


// const { userJoin, getCurrentUser, getRoomSize } = require("./utils/users"); ==> TIL you can't do this because frontend

const { username, room, roomID } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

titleName.textContent = `Room: ${roomID}`;

const shareButton = document.getElementById("shareLinkButton")
function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

shareButton.addEventListener('click', function(){
  console.log();
  copyToClipboard(window.location.href);
})


userNames.push(username);
console.log(username);
console.log(userNames);
if(username == undefined || username=== ''){
  console.log("ERROR in UserNames");
}
function processUserName(nameOfVideo){
  console.log(nameOfVideo);
  let video = nameOfVideo.split("=");

  return video[1];
}
let videoName = processUserName(room);
console.log(videoName);



  


console.log(room);


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
    height: "720",
    width: "1280",
    videoId: videoName,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}


socket.emit("joinRoom", { username, room, videoName,roomID });

socket.emit("hostPausedVideo", { username, room,roomID });

socket.on("message", (message) => {
});

socket.on("pauseMessage", (msg) => {
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
  //todo do something for this
}
function sendInformation(playerStatus) {

  console.log("WE ARE GETTING HERE");
  if (playerStatus == -1) {
  } else if (playerStatus == 0) {
  } else if (playerStatus == 1) {
    //If we are playing a video synch it up
    socket.emit("PlayingVideo", { username, player,roomID });
  } else if (playerStatus == 2) {
    //We are pausing therefore emit, the server handles the fact we only really care about the host
    socket.emit("StoppedVideo", username, roomID);
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

