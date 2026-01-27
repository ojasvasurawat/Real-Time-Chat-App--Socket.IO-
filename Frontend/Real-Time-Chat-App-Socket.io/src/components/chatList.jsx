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
    Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar"

import { UsersRound } from 'lucide-react';


export default function ChatList({sendDataToParent, userData}){

    const [chatList, setChatList] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    

    const handleChat = async(chatId)=>{

        console.log("handle chat",chatId);

        if (currentRoom) {
            socket.emit('leave', {currentRoom});
        }
        console.log(chatId);

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
                    <SidebarMenuButton asChild className={"h-[10vh] m-0"} onClick={()=>handleChat(chat._id)}>
                        <Item>
                            <ItemMedia>
                                <Avatar className={"h-[7vh] w-[7vh]"}>
                                    <AvatarImage src={chat.avatarUrl} />
                                    <AvatarFallback className={chat.isGroup ? "bg-gray-200" : "rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xl"}>{chat.isGroup ? <UsersRound/> : otherUser(chat.name).charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </ItemMedia>    
                            <ItemContent >
                                <ItemTitle className={"text-xl ml-[1vw]"}>{chat.isGroup ? chat.name : otherUser(chat.name) }</ItemTitle>
                            </ItemContent>
                        </Item>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </>
    )
}