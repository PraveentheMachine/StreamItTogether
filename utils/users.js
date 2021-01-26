const users = [];

function userJoin(id, username, room,isHost){
 const user = {
  id,username,room,isHost
 };
 users.push(user);

 return user;
}


function getCurrentUser (id){
 return users.find(user => user.id === id);
}

function getRoomSize(room){
 let counter = 0;
 for(let i = 0; i<users.length;i++){
  console.log(room);
  if(users[i].room === room){
   counter++;
  }
 }
 return counter;
}

module.exports ={
 userJoin,getCurrentUser,getRoomSize
}