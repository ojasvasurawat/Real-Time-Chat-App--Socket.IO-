import axios from 'axios';
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { socket } from "../socket";
import { useLocation } from "react-router-dom";
import Messages from "./messages";
const backendUrl = import.meta.env.VITE_BACKEND_URL;



export default function Chat({chatId, userData}){

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

    // const room = messagesData[0]?.roomId;
    // const name = messagesData[0]?.sender;

    function submit(){
        
        const content = input.current.value;
        console.log(chatId);
        const time = Date();
        console.log(time);
        if(content){
            socket.emit('chat msg', {chatId, content, time});
            setMsgData((prevData) => [...prevData, {content:content, name:userData.username, time:time}]);//----------------------------
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
        if(room){
            socket.emit('typing status', {name, status, room});
        }
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
        
        const getChatMessages = async ()=>{
            const response = await axios.get(`${backendUrl}/chat-messages?chatId=${chatId}`,{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            })
            const messagesData = response.data.messages;
            console.log(messagesData);
            messagesData?.map((message)=>{ 
                setMsgData(
                    (prevData) => ([...prevData, {content:message.content, name:message.sender.username, time:message.createdAt}])
                ) 
            })
        }

        getChatMessages();
        
    },[chatId])

    useEffect(()=>{

        socket.connect();

        console.log(socket.id);

        const handleChatMessage = ({chatId, content, sender, time})=>{
            console.log(socket.id);
            console.log("the broadcasted message is : ",content);
            msgData.map((data)=>{console.log(data)});
            setMsgData((prevData) => ([...prevData, {content:content, name:sender, time:time}]));
            // const item = document.createElement('p');
            // item.textContent = name +"-"+msg+`\n${time}`;
            // messages.current.appendChild(item);
        }

        socket.on('chat message', handleChatMessage);

        const handleTypingStatus = ({name, status, room})=>{
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
                    <Messages key={idx} sendBy={data.name} data={data.content} time={data.time}/>
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