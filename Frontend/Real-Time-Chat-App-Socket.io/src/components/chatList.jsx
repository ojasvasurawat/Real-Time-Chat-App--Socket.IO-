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
  ItemDescription,
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

    const otherUsername = (chat)=>{
        const chatName = chat.name;
        // console.log(chat);
        const names = chatName.split("-");
        return names[0] == userData.username ? names[1] : names[0];
    }

    const otherDisplayname = (chat)=>{
        const participants = chat.participants;
        return participants[0].displayName == userData.displayName ? participants[1].displayName : participants[0].displayName;
    }

    const otherUsernameList = (chat)=>{
        const participants = chat.participants;
        let res = "";
        for(const participant of participants){
            res = res+participant.username.toString()+" , ";
        }
        return res.slice(0, -3);
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
                                    <AvatarFallback className={chat.isGroup ? "bg-gray-200" : "rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xl"}>{chat.isGroup ? <UsersRound/> : otherDisplayname(chat).charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </ItemMedia>    
                            <ItemContent>
                                <ItemTitle className={"text-xl ml-[1vw]"}>{chat.isGroup ? chat.name : otherDisplayname(chat) }</ItemTitle>
                                <ItemDescription className={" ml-[1vw] truncate"}>{chat.isGroup ? otherUsernameList(chat) : otherUsername(chat) }</ItemDescription>
                            </ItemContent>
                        </Item>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </>
    )
}