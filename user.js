let moment= require("moment-timezone")
// npm i moment-timezone
let users=[]
let userJoin=(roomId, peerId, Username,socketId)=>{
  let user={
    roomId,
    peerId,Username,socketId
  }
  users.push(user)
  return user;
}

let userCheck=(roomid)=>{
  for(let i=0;i<users.length;i++){
    if(users[i].roomId==roomid){
      return users[i];
    }
  }
}

let userLeave=(Id)=>{
  let index= users.findIndex((el)=>el.id==Id)
  let leftUser= users.splice(index,1)
  return leftUser[0]
}

let current=(id)=>{
  for(let i=0;i<users.length;i++){
    if(users[i].socketId==id){
      return users[i]
    }
  }
}

let format=(username,msg)=>{
    return {
        username,
        msg,
        time:moment().tz('Asia/Kolkata').format('h:mm a')
    }
}


module.exports={userJoin,userCheck,userLeave , current ,format }