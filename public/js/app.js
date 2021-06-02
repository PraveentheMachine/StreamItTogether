
//
const submitButton = document.getElementById("btnPressed");
const videoElement = document.getElementById("room");
const roomToJoin = document.getElementById("roomToJoin");
const joinPreExitingRoom = document.getElementById("joinPreExitingRoom");
const roomID = document.getElementById("roomID");
const usernameOfJoiner = document.getElementById("usernameOfJoiner");

console.log(joinPreExitingRoom);
joinPreExitingRoom.addEventListener('click', event => {
  console.log(usernameOfJoiner.value);
    console.log(roomToJoin.value);
  let prefix = roomToJoin.value.split("username=") ;
  console.log(prefix);
  let endOfLink = prefix[1].split("&room=");
  console.log(endOfLink);
  let roomSuffix = endOfLink[1];
  let inputString = prefix[0] + `username=${usernameOfJoiner.value}`+"&room="+roomSuffix;
  console.log(inputString);
  event.preventDefault();
  window.location.replace(inputString)


});


const element = document.querySelector('form');
let videoName = ""

element.addEventListener('submit', event => {


  videoName.value = videoElement.value + "^^" + makeid(5);
  // actual logic, e.g. validate the form

  //Making an id for rooms such that we can have different rooms for the same video 
  roomID.value = makeid(5);
  roomID.textContent = makeid(5);



});

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}




