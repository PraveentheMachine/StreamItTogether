/**
 * Room.js is the JavaScript code which is used by index.html to handle users joining the room
 * as a host or as a participant.
 *
 * It is setup into three key components:
 *  "Setup Work" (Initialisations of listeners)
 *  "Room Logic" (Create a Unique Room ID and determine to join a new room or a created one)
 */

//Setup for buttons used for room logic
const submitButton = document.getElementById("btnPressed");
const videoElement = document.getElementById("room");
const roomToJoin = document.getElementById("roomToJoin");
const joinPreExistingRoom = document.getElementById("joinPreExitingRoom");
const roomID = document.getElementById("roomID");
const usernameOfJoiner = document.getElementById("usernameOfJoiner");


/**
 * If we are clicking on a room which exists and want to join 
 */
joinPreExistingRoom.addEventListener('click', event => {
  //Get the username
  let prefix = roomToJoin.value.split("username=") ;
  //Get the room link ID
  let endOfLink = prefix[1].split("&room=");
  let roomSuffix = endOfLink[1];
  //Combine these to form the room ID 
  let inputString = prefix[0] + `username=${usernameOfJoiner.value}`+"&room="+roomSuffix;

  event.preventDefault();
  //reload the screen with the new ID which has the old room and the users Name
  window.location.replace(inputString)


});



const form = document.querySelector('form');
let videoName = ""

//If we are creating a new room we need to make a unique link
form.addEventListener('submit', event => {
  //Create a Room with a unique id
  videoName.value = videoElement.value + "^^" + makeid(5);
  //Making an id for rooms such that we can have different rooms for the same video 
  roomID.value = makeid(5);
  roomID.textContent = makeid(5);
});

/**
 * Method which generates a Unique ID everytime it is called. 
 * @param {*} length 
 * @returns 
 */
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}




