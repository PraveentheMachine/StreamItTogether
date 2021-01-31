const users = [];

function userJoin(id, username, roomID,isHost){
 const user = {
  id,username,roomID,isHost
 };
 users.push(user);
console.log("USER PUSHED");
console.log(user.roomID);
 return user;
}


function getCurrentUser (id){
 return users.find(user => user.id === id);
}

function getRoomSize(room){
 let counter = 0;
 console.log(room);
 for(let i = 0; i<users.length;i++){
  console.log(room + "    VS   "+ users[i].roomID);

  if(users[i].roomID === room){
   counter++;
  }
 }
 return counter;
}

module.exports ={
 userJoin,getCurrentUser,getRoomSize
}