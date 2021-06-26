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
console.log("ASDSAD");
shareButton.addEventListener("click", function () {
  console.log("SAL");
  copyToClipboard(window.location.href);
});

//---------YouTube logic--------------

//If we resize the browser we want to call a Reload and then refresh the page. 
var resizeTimeout;
window.addEventListener("resize", function (event) {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    window.location.reload();
  }, 1500);
});

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


/**
 * Finds the width of the screen based on checking all the possible values and returning the max
 * value which coresponds to the width of the screen 
 * @returns the current width of the screen
 */
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

/**
 * Finds the height of the screen based on checking all the possible values and returning the max
 * value which coresponds to the height of the screen 
 * @returns the current height of the screen
 */
function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

/**
 * Method used to determine the height of the YouTube Player based on the width of the screen
 * @returns the Height of the Screen as a String used by the YouTube API
 */
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
/**
 * Method used to determine the Width of the YouTube Player based on the width of the screen
 * @returns the Width of the Screen as a String used by the YouTube API
 */
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


//This is the YouTube API setup
// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
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

//Emit a JoinRoom message to the server
socket.emit("joinRoom", { username, room, videoName, roomID });
//Emit a hostPaused message to the server
socket.emit("hostPausedVideo", { username, room, roomID });


socket.on("message", (message) => {});

/**
 * If we have received a pause message 
 */
socket.on("pauseMessage", (msg) => {
  player.pauseVideo();
});

//Socket for handling video playing
socket.on("PlayngVideoMsg", (msg) => {
  //If the current time difference between the host and a player is +-0.5 drag the players
  //value to the hosts video time
  if (
    player.getCurrentTime() < msg.player.playerInfo.currentTime - 0.5 ||
    player.getCurrentTime() > msg.player.playerInfo.currentTime + 0.5
  ) {
    //go to this time and playVideo
    player.seekTo(msg.player.playerInfo.currentTime, true);
    player.playVideo();
  }
  //unique quirk of the YouTube API have to playVideo twice to make sure it actually does what is needed
  player.playVideo();
});

/**
 * I could do something in the future with this essentially this is a method called as soon as the player loads
 * @param {*} event 
 */
function onPlayerReady(event) {
}

/**
 * Very important method used by my socket and YouTube api. It acts as a link, essentially based on the playerStatus
 * I must emit a certain message to the server so that it can broadcast it to everyone in the room.
 * For example if the playerStatus == 1 then we are "playing" as the host and this should be known to everyone in the room
 * @param {*} playerStatus the status of the YouTube player. 
 */
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
  }
}

//Function provided by the YouTube API which handles when the host is changing between states
function onPlayerStateChange(event) {
  sendInformation(event.data);
}



/**
 * If we receive a videoChange method from the server we must use the "newVideo" parameter
 * to refresh the video and change the video used by the YouTube API. This must be done for everyone
 * in the room. 
 */
socket.on("videoChange", (newVideo) => {

  // getting the UUID for the YouTube video based on the link provided
  const newVideoLink = newVideo.split("https://www.youtube.com/watch?v=");
  //The UUID for the new YouTubeVideo
  const linkID = newVideoLink[1];
  //getting the previous ID for REGEX replace function
  let oldLink = window.location.href.split("www.youtube.com%2Fwatch%3Fv%3D");
  console.log("Other People");
  let idOld = oldLink[1].split("&roomID=");
  let newString = "" + window.location.href;
  newString = newString.replace(idOld[0], linkID);
  location.replace(newString);

  console.log(window.location.href);
});

/**
 * If we are changing the video we must get the YouTube link of the new Video and send this to the server
 * to determine if we are at a host and if we are then we must change the video after emiting the socket. 
 */
const refreshVideo = document.getElementById("changeVideo");
refreshVideo.addEventListener("click", function () {
  var newVideo = prompt("What is the new video?");
  //We have input
  if (
    newVideo !== undefined &&
    newVideo.includes("https://www.youtube.com/watch?v=")
  ) {
    socket.emit("changeVideo", username, roomID, newVideo);
  }
});

