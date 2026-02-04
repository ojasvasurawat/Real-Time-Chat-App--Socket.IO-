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
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';


export default function ChatList({sendDataToParent, userData, onlineUsersList}){

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
            // console.log(response.data.chats);
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

    const otherUserAvatarUrl = (chat)=>{
        if(chat.isGroup) return;
        const otherusername = otherUsername(chat);
        // console.log(otherusername);
        return chat.participants[0].username === otherusername ? chat.participants[0].avatarUrl : chat.participants[1].avatarUrl;
    }

    const otherDisplayname = (chat)=>{
        const participants = chat.participants;
        return participants[0].displayName == userData.displayName ? participants[1].displayName : participants[0].displayName;
    }

    const otherUsernameList = (chat)=>{
        return(
            <>
            <span className={"text-blue-400"}>
                {otherOnlineUsernameList(chat)}
            </span>
            <span className={""}>
                {otherOfflineUsernameList(chat)}
            </span>
            </>
        )
    }

    const otherOnlineUsernameList = (chat)=>{
        const participants = chat.participants;
        let onlineRes = [];
        for(const participant of participants){
            if( onlineUsersList.includes(participant.username) && participant.username !== userData.username){
                onlineRes.push(participant.username.toString()+" ");
            }
        }
        // console.log(onlineRes);
        return onlineRes;
    }

    const otherOfflineUsernameList = (chat)=>{
        const participants = chat.participants;
        let offlineRes = [];
        for(const participant of participants){
            if( !onlineUsersList.includes(participant.username) ){
                offlineRes.push(participant.username.toString()+" ");
            }
        }
        offlineRes.push(userData.username);
        // console.log(offlineRes);
        return offlineRes;
    }

    const isOnline = (chat)=>{
        const name = otherUsername(chat);
        return onlineUsersList.includes(name);
    }

    return(
        <>

            <SidebarMenu>
                {chatList.map((chat) => (
                <SidebarMenuItem key={chat._id}>
                    <SidebarMenuButton asChild className={"h-[10vh] m-0"} onClick={()=>handleChat(chat._id)}>
                        <Item>
                            <ItemMedia>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <Avatar className={"h-[7vh] w-[7vh]"}>
                                            <AvatarImage src={otherUserAvatarUrl(chat)} />
                                            <AvatarFallback className={chat.isGroup ? "bg-gray-400  flex items-center justify-center font-semibold text-xl" : "bg-gray-600  flex items-center justify-center font-semibold text-xl"}>{chat.isGroup ? <UsersRound/> : otherDisplayname(chat).charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-surface ">
                                        <AlertDialogHeader >
                                            <Avatar className="w-50 h-50 md:w-100 md:h-100 rounded-full mx-auto">
                                                <AvatarImage src={otherUserAvatarUrl(chat)} />
                                                <AvatarFallback className={chat.isGroup ? "bg-gray-400  flex items-center justify-center font-semibold text-8xl md:text-[200px]" : "bg-gray-600  flex items-center justify-center font-semibold text-8xl md:text-[200px]"}>{chat.isGroup ? <UsersRound className="w-[94px] h-[94px] md:w-[170px] md:h-[170px]"/> : otherDisplayname(chat).charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <AlertDialogTitle></AlertDialogTitle>
                                            <AlertDialogDescription></AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className={"mx-auto"}>Back</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </ItemMedia>    
                            <ItemContent>
                                <ItemTitle className={"text-xl ml-4 "}>{chat.isGroup ? chat.name : otherDisplayname(chat) }</ItemTitle>
                                <ItemDescription className={`ml-4 truncate ${isOnline(chat) ? "text-blue-400" : ""}`}>{chat.isGroup ? otherUsernameList(chat) : isOnline(chat) ? `${otherUsername(chat)} is online` : `${otherUsername(chat)} is offline` }</ItemDescription>
                            </ItemContent>
                        </Item>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </>
    )
}