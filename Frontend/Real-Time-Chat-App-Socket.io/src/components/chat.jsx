import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {io} from "socket.io-client";
import { useLocation } from "react-router-dom";
import Messages from "./messages";

const socket = io("http://localhost:3000/chat");


export default function Chat({messagesData}){

    // const location = useLocation();
    // const {name} = location.state || {};

    let [socketStatus, setSocketStatus] = useState(true);
    let [msgData, setMsgData] = useState([]);
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
            setMsgData((prevData) => [...prevData, {data:msg, name:name, time:time}]);
            console.log(socket.id);
            console.log("msg emmited");
            // const item = document.createElement('p');
            // item.textContent = name+"-"+msg+`\n${time}`;
            // Object.assign(item.style, {
            //     textAlign: 'right',
            // })
            // messages.current.appendChild(item);
            input.current.value = "";
        }
    }

    function handleChange(event){
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

    // function disconnect(){
    //     socket.disconnect();
    // }

    useEffect(()=>{
        console.log(messagesData);
        messagesData?.map((message)=>{ 
            setMsgData(
                (prevData) => ([...prevData, {data:message.content, name:message.sender, time:message.createdAt}])
            ) 
        })
    },[messagesData])

    useEffect(()=>{

        socket.connect();

        const handleChatMessage = ({msg, name, time})=>{
            console.log(socket.id);
            console.log("the broadcasted message is : ",{msg, name});
            msgData.map((data)=>{console.log(data)});
            setMsgData((prevData) => ([...prevData, {data:msg, name:name, time:time}]));
            // const item = document.createElement('p');
            // item.textContent = name +"-"+msg+`\n${time}`;
            // messages.current.appendChild(item);
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
            socket.disconnect();
        };
    },[])


    
    
      
    
    return (
        <>
            <h3>{name}</h3>
            <div>socket status: {socketStatus ? "connected" : "disconnected"}</div> 
            <div ref={messages} style={{height: '300px', overflowY: 'scroll'}}>
                {msgData.map((data, idx)=>(
                    <Messages key={idx} sendBy={data.name} data={data.data} time={data.time}/>
                ))}
            </div>
            <div>
                <input type="text" placeholder="enter your message" ref={input} onKeyDown={handleKeyDown} onChange={handleChange}/>
                <button onClick={submit}>Send</button>
                <button onClick={toggleConnection}>{socketStatus ? "disconnect from socket" : "connect to socket"}</button>
                {/* <button onClick={disconnect}>disconnect</button> */}
            </div>
        </>
    )
}