const express = require("express")
const app = express()
const http = require("http")
const http_server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(http_server)
const { v4: uuidv4 } = require("uuid")
const path = require("path")
const { userJoin, userLeave, userCheck, current, format } = require("./user")

app.use(express.static(path.join(__dirname, './frontend')));
app.get("/TicTack", (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get("/aiPlayer",(req,res)=>{
    res.sendFile(path.join(__dirname,'./frontend/aiPlayer.html'))
})

let and;
app.get("/",(req,res)=>{
    and=req.ip;
    console.log(req.ip)
    res.sendFile(path.join(__dirname,'./frontend/index.html'))
})
 
 
let secCheck;
app.get("/:room", (req, res) => {
    roomID=req.params.room;
    secCheck=userCheck(roomID) 
    res.sendFile(path.join(__dirname, './frontend/TicTackToe.html'))
})
let container;
io.on("connection", (socket) => {
 
    if(secCheck){
        socket.emit("secInput",(secCheck.Username))

        socket.to(secCheck.roomId).emit("select",("msg"))
        container=socket.id


    }
    socket.on("firstClick", ({ roomId, id, firstUserName }) => {
        let user = userJoin(roomId, id, firstUserName, socket.id)
        socket.join(roomId)
    })

    socket.on("SecName",({roomId,id,secUserName})=>{
        let user=userJoin(roomId, id, secUserName ,socket.id )
        // console.log(user);
        socket.join(roomId)
        socket.broadcast.emit("nameDisplay",(secUserName))
        io.to(roomId).emit("final",("ntg msg"))
    })

    socket.on("msgCap",(msg)=>{
        let user=current(socket.id)
        let msgObj= format(user.Username,msg)
        socket.emit("rightSide",(msgObj))
        socket.to(user.roomId).emit("leftSide",(msgObj))
    })



    ///////
    socket.on("callReq",(msg)=>{
        let user=current(socket.id)
        socket.to(user.roomId).emit("callReqServer","ntg msg")
    })
   
    socket.on("callAccepted",(msg)=>{
        let user=current(socket.id)
        socket.to(user.roomId).emit("callAcceptedServer",(user.peerId))
    })
 



    // tictack


    
    socket.on("chance",(msg)=>{
        if(socket.id == container){
            let jaa=elseId(socket.id)
            container=jaa
            socket.emit("select",("nsg"))
        }else{
            container=socket.id
            let user= current(socket.id)
            socket.to(user.roomId).emit("select",("msg"))
        }
        let uuser= current(socket.id)
        io.to(uuser.roomId).emit("safai",("NTG"))
    })

    socket.on("decl",({gameWon})=>{
        let user= current(socket.id)
        socket.to(user.roomId).emit("sab",({gameWon}))
    })
   
    socket.on("secTime",({ans,firstP,secP})=>{
        let user= current(socket.id)
        socket.to(user.roomId).emit("sECpLAYER",({ans,firstP,secP}))
    })

    socket.on("innerHtml",({squareId,player,origB})=>{
        let user= current(socket.id)
        socket.to(user.roomId).emit("sq",({squareId,player,origB}))
    })







    socket.on("disconnect", () => {
        let user = userLeave(socket.id)
        if (user) {
            console.log(`${user.Username} has left`);
        }

    })
})


http_server.listen(3000, () => {
    console.log("server is running on 3000");
    console.log(and)
})
