import { io } from "socket.io-client";

export const socket = io(
  // "http://localhost:3000/chat",
  "https://real-time-chat-app-socket-io-tcnh.onrender.com/chat"
  , {
  transports: ["websocket"],
  auth:{
    token: localStorage.getItem('authorization')
  }
});
