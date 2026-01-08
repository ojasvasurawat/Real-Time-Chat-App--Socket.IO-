// import './App.css'
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react"
import {io} from "socket.io-client"

const socket = io.connect("http://localhost:3000/");

function App() {
  const {text, setText} = useState("");
  const input = useRef(null);
  const messages = useRef(null);
  // const socket = io("http://localhost:3000/");

  function submit(){
    const msg = input.current.value
    // console.log(msg);
    if(msg){
      socket.emit('chat msg', msg);
      console.log("msg emmited");
      const item = document.createElement('p');
      item.textContent = msg;
      Object.assign(item.style, {
        textAlign: 'right',
      })
      messages.current.appendChild(item);
      input.current.value = "";
    }
  }

  socket.on('chat message', (msg)=>{
    console.log("the broadcasted message is : ",msg);
    const item = document.createElement('p');
    item.textContent = msg;
    messages.current.appendChild(item);
  })
  

  return (
    <>
      <div ref={messages} style={{height: '95vh', overflowY: 'scroll'}}></div>
      <div>
        <input type="text" placeholder="enter your message" ref={input}/>
        <button onClick={submit}>Send</button>
      </div>
    </>
  )
}

export default App
