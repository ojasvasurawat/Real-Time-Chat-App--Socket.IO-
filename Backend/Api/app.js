const express = require("express");
const cors = require("cors");
const { signUp, signIn } = require("../auth/auth");
const {auth} = require("../middleware/middleware");
const {server, app} = require("../socket/socket");
const {addChat, getChatList, getChatMessages, createGroup, getProfile} = require("../Functions/functions")

require("dotenv").config();

const SOCKET_PORT = process.env.SOCKET_PORT;


const mainApp = app;

mainApp.use(cors());
mainApp.use(express.json({limit: '10mb'}));

mainApp.post("/signup", signUp);
mainApp.post("/signin", signIn);

mainApp.use(auth);

mainApp.get("/chat-list", getChatList);
mainApp.post("/add-chat", addChat);
mainApp.get("/chat-messages", getChatMessages);
mainApp.post("/create-group", createGroup)
mainApp.get("/profile", getProfile);



//SOCKET_PORT AND APP_PORT ARE SAME
server.listen(SOCKET_PORT, ()=>{
    console.log("listening on socket port",SOCKET_PORT);
});