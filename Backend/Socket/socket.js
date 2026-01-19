const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173'
}));

const {Server} = require('socket.io');

const {createServer} = require('node:http'); // or const http = require('node:http');
const { sktMdw } = require('../middleware/middleware');
const { UserModel, MessageModel } = require('../db/db');
const server = createServer(app); // const server = http.createServer(...);

// const {join} = require('node:path');

const io = new Server(server, {
  connectionStateRecovery: {},
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
  },
//   path:"/chat"
});

let users = []

// io.use(sktMdw); // this woas wrong it 
io.of("/chat").use(sktMdw) // insted use this for namespace middleware

io.of("/chat").on('connection', (socket)=>{

    const userId = socket.ObjectId;
    // socket.broadcast.emit('hi');
    console.log(socket.id);
    users.push(socket.id);
    console.log("user list : ", users);
    console.log('a user connected');

    socket.on('join', ({chatId})=>{
        socket.join(chatId);
        console.log("room ",chatId," joined!! by: "+socket.id);
    })

    socket.on('leave', ({chatId}) => {
        socket.leave(chatId);
        console.log("room ",chatId," leaved!! by: "+socket.id);
    });


    socket.on('chat msg', async ({chatId, content, time}) => {
        try{
            console.log('msg recived: ' + content+" in room: "+chatId);
            const message = await MessageModel.create({
                chat: chatId,
                sender: userId,
                content: content
            })
            // socket.broadcast.emit('chat message', {msg, name, time});
            const getSender = async ()=>{
                return await UserModel.findById(userId);
            }
            const sender = getSender();
            socket.to(chatId).emit('chat message', {chatId, content, sender, time});
        }
        catch(err){
            console.log("error in chat msg listner : ", err);
        }
    });

    // socket.on('typing status', ({name, status, room})=>{
    //     console.log(name+" is typing...");
    //     // socket.broadcast.emit('typ status', {name, status});
    //     socket.to(room).emit('typ status', {name, status});
    // })

    socket.on('disconnect', ()=>{
        idx = users.indexOf(socket.id);
        users.splice(idx, 1);
        console.log('user disconnect');
    })
});


// server.listen(port, ()=>{
//     console.log("listening on port",port);
// });

module.exports = {
    server,
    app
}