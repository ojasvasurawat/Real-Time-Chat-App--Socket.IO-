import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../socket';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import {SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton 
} from "@/components/ui/sidebar"

import {
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import {
  Avatar,
} from "@/components/ui/avatar"


export default function ChatList({sendDataToParent, userData}){

    const [chatList, setChatList] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    

    const handleChat = async(chatId)=>{

        console.log("handle chat",chatId);

        if (currentRoom) {
            socket.emit('leave', {currentRoom});
        }
        console.log(chatId)

        socket.emit('join', {chatId});
        setCurrentRoom(chatId);

        sendDataToParent(chatId);
    }

    useEffect(()=>{
        async function fetchChatList(){
            const response = await axios.get(`${backendUrl}/chat-list`,{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });
            console.log(response.data.chats);
            setChatList(response.data.chats);
        }
        fetchChatList();
        
    },[])

    const otherUser = (name)=>{
        const names = name.split("-");
        return names[0] == userData.username ? names[1] : names[0];
    }

    return(
        <>

            <SidebarMenu>
                {chatList.map((chat) => (
                <SidebarMenuItem key={chat._id}>
                    <SidebarMenuButton asChild onClick={()=>handleChat(chat._id)}>
                        {/* <span>{chat.isGroup ? chat.name : otherUser(chat.name) }</span> */}
                        {/* <ItemMedia> */}
                            {/* <Avatar>
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                            </Avatar> */}
                        {/* </ItemMedia> */}
                        <ItemContent >
                            <ItemTitle>{chat.isGroup ? chat.name : otherUser(chat.name) }</ItemTitle>
                            {/* <ItemDescription>{person.email}</ItemDescription> */}
                        </ItemContent>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </>
    )
}