const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173'
}));

const {Server} = require('socket.io');

const {createServer} = require('node:http');
const server = createServer(app);

const {join} = require('node:path');

const io = new Server(server, {
  connectionStateRecovery: {},
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
  }
});

// app.get('/', (req, res)=>{
//     // res.send("<h1> hello world </h1>");
//     // console.log(__dirname);
//     res.sendFile(join(__dirname, 'index.html'));
//     // res.sendFile('D:/Ojasva/Projects/Real-Time Chat-App-(Socket.IO)/Frontend/Real-Time-Chat-App-Socket.io/index.html')
// });

// console.log(io)

let users = []

io.on('connection', (socket)=>{
    // socket.broadcast.emit('hi');
    console.log(socket.id);
    users.push(socket.id);
    console.log("user list : ", users);
    console.log('a user connected');

    socket.on('chat msg', ({msg, name, time}) => {
        console.log('msg recived: ' + msg+" by :"+name+" at : "+time);
        socket.broadcast.emit('chat message', {msg, name, time});
    });

    socket.on('typing status', ({name, status})=>{
        console.log(name+" is typing...");
        socket.broadcast.emit('typ status', {name, status});
    })

    socket.on('disconnect', ()=>{
        idx = users.indexOf(socket.id);
        users.splice(idx, 1);
        console.log('user disconnect');
    })
});


server.listen(port, ()=>{
    console.log("listening on port",port);
});