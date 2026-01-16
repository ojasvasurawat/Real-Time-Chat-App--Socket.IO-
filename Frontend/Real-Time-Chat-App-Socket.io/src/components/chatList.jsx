import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import {io} from "socket.io-client";

const socket = io("http://localhost:3000/chat");

export default function ChatList(props){

    const [chatList, setChatList] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    

    const handleChat = async(roomId)=>{
        console.log(roomId)
        socket.emit('join', {room:roomId});


        const response = await axios.get(`${backendUrl}/chat-messages`,{
            params:{roomId},
            headers:{
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authorization')
            }
        });

        const messages = response.data.messages;
        // console.log(messages);
        setChatMessages(messages);
        // sendData();
    }

    useEffect(()=>{
        const sendData = () => {
            // Call the parent's function via props, passing the variable
            console.log(chatMessages);
            props.sendDataToParent(chatMessages);
        }
        sendData();
    },[chatMessages])

    useEffect(()=>{
        async function fetchChatList(){
            const response = await axios.get(`${backendUrl}/chat-list`,{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });
            // console.log(response.data.chatList);
            setChatList(response.data.chatList);
        }
        fetchChatList();
        
    },[])

    return(
        <>
            <div>
                {chatList.map(chat=>(
                    <div onClick={()=>handleChat(chat.roomId)} key={chat.roomId}>{chat.chatUsername}</div>
                ))}
            </div>
        </>
    )
}