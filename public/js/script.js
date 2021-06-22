
/**
 * Script.js is the JavaScript code which 
 * 
 * It is setup into three key components:
 *  "Setup Work" (Initialisations, helper method creation)
 *  "YouTube Logic" ()
 * 
 * If I was to make an improvement into the near future based on learnings based on the development roles
 * and university study, I would definitely decompose this method into smaller chunks and each component would be its own class.
 */


//---------Setup Work--------------
// In this portion of the code I do the setup work required
//


//Creating the socket for the Room to be hosted 
const socket = io();

//Acccesing the button for copying the link
const btnPressed = document.getElementById("");
//Getting the titleName and the form element 
let titleName = document.querySelector("title");
const formElement = document.querySelector('form');

//Array to store usernames for people in the room
let userNames = [];

//Deconstructing the query String 
const { username, room, roomID } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Setting the titleName of the Room (The Title you see on the tab) to the Room ID
titleName.textContent = `Room: ${roomID}`;

//Setting up the sharebutton which allows the Host to share the Room ID with friends.  
const shareButton = document.getElementById("shareLinkButton")

/**
 * Method for creating copy to clipboard functionality for room joining
 * @param {*} text the text which is copied over from the window prompt 
 */
function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

//Adding a listener to the sharebutton which calls the function, copy to clipboard
//which essentialy notifies someone to share  
shareButton.addEventListener('click', function(){
  copyToClipboard(window.location.href);
})

//--------------------------------------------- ------------------------------------------
if(username == undefined || username=== ''){
  console.log("ERROR in UserNames");
}

userNames.push(username);


function processUserName(nameOfVideo){
  console.log(nameOfVideo);
  let video = nameOfVideo.split("=");

  return video[1];
}
let videoName = processUserName(room);
console.log(videoName);



/**
 * 
 * @param {*} message 
 */
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
  console.log(player.getCurrentTime());
  console.log(msg.player.playerInfo.currentTime);
    console.log(msg.player.playerInfo.currentTime-0.5);
console.log(player.getCurrentTime() < msg.player.playerInfo.currentTime - 0.5)
  if (player.getCurrentTime() < msg.player.playerInfo.currentTime - 0.5) {
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
