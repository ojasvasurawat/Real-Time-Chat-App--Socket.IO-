const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173/'
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


io.on('connection', (socket)=>{
    // socket.broadcast.emit('hi');
    console.log('a user connected');

    socket.on('chat msg', (msg) => {
        console.log('msg recived: ' + msg);
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('disconnect', ()=>{
        console.log('user disconnect');
    })
});


server.listen(port, ()=>{
    console.log("listening on port",port);
});