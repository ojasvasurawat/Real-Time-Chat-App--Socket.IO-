import { io } from "socket.io-client";

export const socket = io("http://localhost:3000/chat", {
  transports: ["websocket"],
  auth:{
    token: localStorage.getItem('authorization')
  }
});
