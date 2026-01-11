const express = require('express'); 
const app = express();

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173'
}));

const {Server} = require('socket.io');

const {createServer} = require('node:http'); // or const http = require('node:http');
const server = createServer(app); // const server = http.createServer(...);

// const {join} = require('node:path');

const io = new Server(server, {
  connectionStateRecovery: {},
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
  }
});

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


// server.listen(port, ()=>{
//     console.log("listening on port",port);
// });

module.exports = {
    server,
    app
}