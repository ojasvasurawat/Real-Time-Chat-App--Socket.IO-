const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({
    origin: [
        // 'http://localhost:5173',
        "https://real-time-chat-app-socket-io-eight.vercel.app"
    ]
}));

const {Server} = require('socket.io');

const {createServer} = require('node:http'); // or const http = require('node:http');
const { sktMdw } = require('../Middleware/middleware');
const { UserModel, MessageModel } = require('../DB/db');
const server = createServer(app); // const server = http.createServer(...);

// const {join} = require('node:path');

const io = new Server(server, {
  connectionStateRecovery: {},
  cors:{
    origin:[
        // "http://localhost:5173", 
        "https://real-time-chat-app-socket-io-eight.vercel.app"
    ],
    methods:["GET","POST"],
    credentials:true
  },
//   path:"/chat"
});

const onlineUsers = new Map();

// io.use(sktMdw); // this was wrong it 
io.of("/chat").use(sktMdw) // insted use this for namespace middleware

io.of("/chat").on('connection', async (socket)=>{

    const userId = socket.ObjectId;
    // socket.broadcast.emit('hi');
    console.log(socket.id);
    console.log('a user connected');

    const user = await UserModel.findById(userId);

    if (!onlineUsers.has(user.username)) {
        onlineUsers.set(user.username, new Set());
    }
    onlineUsers.get(user.username).add(socket.id);

    console.log("Online users:", [...onlineUsers.keys()]);

    io.of("/chat").emit("online users", [...onlineUsers.keys()]);

    socket.on('join', ({chatId})=>{
        socket.join(chatId);
        console.log("room ",chatId," joined!! by: "+socket.id);
    })

    socket.on('leave', ({chatId}) => {
        socket.leave(chatId);
        console.log("room ",chatId," leaved!! by: "+socket.id);
    });


    socket.on('chat msg', async ({chatId, content, time, avatarUrl}) => {
        try{
            console.log('msg recived: ' + content+" in room: "+chatId);
            const message = await MessageModel.create({
                chat: chatId,
                sender: userId,
                content: content,
                avatarUrl: avatarUrl
            })
            // socket.broadcast.emit('chat message', {msg, name, time});
            const getSender = async ()=>{
                const res = await UserModel.findById(userId);
                return res.username;
            }
            const sender = await getSender();
            // console.log(sender);
            socket.to(chatId).emit('chat message', {chatId, content, sender, time, avatarUrl});
        }
        catch(err){
            console.log("error in chat msg listner : ", err);
        }
    });

    socket.on('typing status', ({username, status, chatId})=>{
        console.log(username+" is typing...");
        // socket.broadcast.emit('typ status', {name, status});
        socket.to(chatId).emit('typ status', {username, status});
    })

    socket.on('disconnect', ()=>{
        console.log('user disconnect');

        if(!user || !user.username) return;

        const sockets = onlineUsers.get(user.username);

        if (sockets) {
            sockets.delete(socket.id);

            if (sockets.size === 0) {
                onlineUsers.delete(user.username);
            }
        }

        console.log("Online users:", [...onlineUsers.keys()]);

        io.of("/chat").emit("online users", [...onlineUsers.keys()]);
        })
});


// server.listen(port, ()=>{
//     console.log("listening on port",port);
// });

module.exports = {
    server,
    app
}