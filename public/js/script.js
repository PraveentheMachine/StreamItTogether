/**
 * Script.js is the JavaScript code which is used by hostingpage.html to create the YouTube video
 *  and provide the host with functionality.
 *
 * It is setup into three key components:
 *  "Setup Work" (Initialisations, helper method creation)
 *  "YouTube Logic" (Handling the YouTube api and its interactions with work done in setup)
 *  "Socket Logic"
 *
 * If I was to make an improvement into the near future based on learnings based on the development roles
 * and university study, I would definitely decompose this method into smaller chunks and each component would be its own class.
 */

//---------Setup Work--------------
// In this portion of the code I do the setup work required for the YouTube helper methods

//Creating the socket for the Room to be hosted

const socket = io();

//Acccesing the button for copying the link
const btnPressed = document.getElementById("");
//Getting the titleName and the form element
let titleName = document.querySelector("title");
const formElement = document.querySelector("form");

//Array to store usernames for people in the room
let usernameList = [];

//Deconstructing the query String
const { username, room, roomID } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Setting the titleName of the Room (The Title you see on the tab) to the Room ID
titleName.textContent = `Room: ${roomID}`;

//Setting up the sharebutton which allows the Host to share the Room ID with friends.
const shareButton = document.getElementById("shareLinkButton");

/**
 * Method for creating copy to clipboard functionality for room joining
 * @param {*} text the text which is copied over from the window prompt
 */
function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

//Adding a listener to the sharebutton which calls the function, copy to clipboard
//which essentialy notifies someone to share
shareButton.addEventListener("click", function () {
  copyToClipboard(window.location.href);
});

//---------YouTube logic--------------

//If the username provided to us by a new room joiner is undefined or empty there are issues
if (username == undefined || username === "") {
  console.log("ERROR");
}

//If we pass this check it is safe to add the username provided to the use
usernameList.push(username);

/**
 * Method which takes a String such as https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * and gets the video id which is used by the YouTube API to do a request
 * @param {*} videoLink the link to the video
 * @returns the unique video id
 */
function getYouTubeVideoID(videoLink) {
  console.log("processUserName is called");
  console.log(videoLink);
  let video = videoLink.split("=");
  //would return "dQw4w9WgXcQ" for example
  return video[1];
}
//
let videoName = getYouTubeVideoID(room);

//Load the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

console.log("Width:  " + getWidth());
console.log("Height: " + getHeight());

function setHeight() {
  let height = 0.5 * getHeight();
  let width = getWidth();
  if (width >= 0 && width <= 640) {
    height = 256;
  }
  if (width >= 0 && width < 768) {
    height = 360;
  }
  if (width >= 768 && width < 960) {
    height = 480;
  }
  if (width >= 960 && width < 1024) {
    height = 540;
  }
  if (width >= 1024 && width < 1280) {
    height = 576;
  }
  if (width > 1280) {
    height = 720;
  }

  return height.toString();
}
//Do More Testing on breakpoints to make formula 
function setWidth() {
  let width = getWidth();

  if (width >= 0 && width < 768) {
    width = 485;
  }
  if (width >= 768 && width < 960) {
    width = 640;
  }
  if (width >= 960 && width < 1024) {
    width = 854;
  }
  if (width >= 1024 && width < 1280) {
    width = 960;
  }
  if (width > 1280) {
    width = 1280;
  }
  console.log(width + "Widther");
  return width.toString();
}
//1920 1080
// calculateHeight();
// calculateWidth();
var player;
function onYouTubePlayerAPIReady() {
  player = new YT.Player("ytplayer", {
    height: setHeight(),
    width: setWidth(),
    videoId: videoName,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

//---------Socket logic--------------

socket.emit("joinRoom", { username, room, videoName, roomID });

socket.emit("hostPausedVideo", { username, room, roomID });

socket.on("message", (message) => {});

socket.on("pauseMessage", (msg) => {
  player.pauseVideo();
});

//Socket for handling video messaging
socket.on("PlayngVideoMsg", (msg) => {
  console.log(player.getCurrentTime());
  console.log(msg.player.playerInfo.currentTime);
  console.log(msg.player.playerInfo.currentTime - 0.5);
  console.log(
    player.getCurrentTime() < msg.player.playerInfo.currentTime - 0.5
  );
  if (player.getCurrentTime() < msg.player.playerInfo.currentTime - 0.5 || player.getCurrentTime() > msg.player.playerInfo.currentTime + 0.5 ) {
    player.seekTo(msg.player.playerInfo.currentTime, true);
    player.playVideo();
  }
  player.playVideo();
});

function onPlayerReady(event) {
  //todo do something for this
}
function sendInformation(playerStatus) {
  if (playerStatus == -1) {
  } else if (playerStatus == 0) {
  } else if (playerStatus == 1) {
    //If we are playing a video synch it up
    socket.emit("PlayingVideo", { username, player, roomID });
  } else if (playerStatus == 2) {
    //We are pausing therefore emit, the server handles the fact we only really care about the host
    socket.emit("StoppedVideo", username, roomID);
  } else if (playerStatus == 3) {
    //Do nothing if we are buffering
    // color = "#AA00FF"; // buffering = purple
  } else if (playerStatus == 5) {
    // color = "#FF6DOO"; // video cued = orange
  }
}

//Function provided by the YouTube API which handles when the host is changing between states
function onPlayerStateChange(event) {
  sendInformation(event.data);
}
