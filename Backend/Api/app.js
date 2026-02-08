const express = require("express");
const cors = require("cors");
const {auth} = require("../Middleware/middleware");
const {server, app} = require("../Socket/socket");
const { getChatList } = require("../Functions/getChatList");
const { addChat } = require("../Functions/addChat");
const { getChatMessages } = require("../Functions/getChatMessages");
const { createGroup } = require("../Functions/createGroup");
const { getInfo } = require("../Functions/getInfo");
const { addProfilePicture } = require("../Functions/addProfilePicture");
const { signUp, signIn, logout } = require("../Auth/auth");
const { updateDisplayname } = require("../Functions/updateDisplayname");
const { updatePassword } = require("../Functions/updatePassword");

require("dotenv").config();

const SOCKET_PORT = process.env.SOCKET_PORT;

const allowedOrigins = [
  "https://real-time-chat-app-socket-io-eight.vercel.app",
  // add custom domain later if you have one
//   "http://localhost:5173"
];

const mainApp = app;

mainApp.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server, Postman

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }));
mainApp.use(express.json({limit: '10mb'}));

mainApp.post("/signup", signUp);
mainApp.post("/signin", signIn);

mainApp.use(auth);

mainApp.get("/chat-list", getChatList);
mainApp.post("/add-chat", addChat);
mainApp.get("/chat-messages", getChatMessages);
mainApp.post("/create-group", createGroup)
mainApp.get("/info", getInfo);
mainApp.post("/add-profile-picture", addProfilePicture);
mainApp.post("/update-displayname", updateDisplayname);
mainApp.post("/update-password", updatePassword);
mainApp.post("/logout", logout);



//SOCKET_PORT AND APP_PORT ARE SAME
server.listen(SOCKET_PORT, ()=>{
    console.log("listening on socket port",SOCKET_PORT);
});