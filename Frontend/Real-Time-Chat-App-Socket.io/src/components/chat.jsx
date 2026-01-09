import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {io} from "socket.io-client";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:3000/");


export default function Chat(){

    const location = useLocation();
    const {name} = location.state || {};
    let [socketStatus, setSocketStatus] = useState(false);
    let [msgData, setMsgData] = useState("");
    const input = useRef(null);
    const messages = useRef(null);
    const toggleButton = useRef(null);
    // const socket = io("http://localhost:3000/");

    function handleKeyDown(event){
        if(event.key === "Enter"){
            submit();
        }
    }

    function submit(){
        const msg = input.current.value
        // console.log(msg);
        const time = Date().slice(16,21);
        console.log(time);
        if(msg){
            socket.emit('chat msg', {msg, name, time});
            console.log(socket.id);
            console.log("msg emmited");
            const item = document.createElement('p');
            item.textContent = name+"-"+msg+`\n${time}`;
            Object.assign(item.style, {
                textAlign: 'right',
            })
            messages.current.appendChild(item);
            input.current.value = "";
        }
    }

    function handleChange(event){
        setMsgData(event.target.value);
        console.log("handleChange running...");
        const status="typing"
        socket.emit('typing status', {name, status});
    }

    function toggleConnection(){
        if(socketStatus){
            socket.disconnect();
            console.log("status:",socket.connected);
            setSocketStatus(false);
        }
        else{
            socket.connect();
            console.log("status:",socket.connected);
            setSocketStatus(true);
        }
    }

    useEffect(()=>{

        const handleChatMessage = ({msg, name, time})=>{
            console.log(socket.id);
            console.log("the broadcasted message is : ",{msg, name});
            const item = document.createElement('p');
            item.textContent = name +"-"+msg+`\n${time}`;
            messages.current.appendChild(item);
        }

        socket.on('chat message', handleChatMessage);

        const handleTypingStatus = ({name, status})=>{
            console.log(name+" is typing...");
            const typingBox = document.createElement('p');
            // typingBox.className("typingStatus");
            typingBox.textContent = name+" typing...";
            messages.current.appendChild(typingBox);
            setTimeout(() => {
                typingBox.remove();
            }, 80);
        }

        socket.on('typ status', handleTypingStatus);

        return ()=>{
            socket.off('chat message', handleChatMessage);
            socket.off('typ status', handleTypingStatus);
        };
    },[])


    
    
      
    
    return (
        <>
            <h3>{name}</h3>
            <div>socket status: {socketStatus ? "connected" : "disconnected"}</div>
            <div ref={messages} style={{height: '300px', overflowY: 'scroll'}}></div>
            <div>
                <input type="text" placeholder="enter your message" ref={input} onKeyDown={handleKeyDown} onChange={handleChange}/>
                <button onClick={submit}>Send</button>
                <button onClick={toggleConnection}>{socketStatus ? "disconnect from socket" : "connect to socket"}</button>
            </div>
        </>
    )
}