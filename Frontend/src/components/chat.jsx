import axios from 'axios';
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { socket } from "../socket";
import Messages from "./messages";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
    ItemDescription,
    ItemActions,
} from "@/components/ui/item"

import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"

import { ArrowLeft, UsersRound } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';



export default function Chat({ chatId, userData, onlineUsersList, onBack }) {

    // const location = useLocation();
    // const {name} = location.state || {};

    let [socketStatus, setSocketStatus] = useState(true);
    let [msgData, setMsgData] = useState([]);
    let [chatData, setChatData] = useState(null);
    const input = useRef(null);
    const messages = useRef(null);
    const toggleButton = useRef(null);
    // const socket = io("http://localhost:3000/");
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [messageText, setMessageText] = useState("");

    const bottomInChat = useRef(null);

    const isMobile = useIsMobile();
    const navigate = useNavigate();


    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            submit();
        }
    }

    // const room = messagesData[0]?.roomId;
    // const name = messagesData[0]?.sender;

    function submit() {

        let content = input.current.value;
        console.log(chatId);
        const time = new Date().toISOString();
        console.log(time);
        if (!content || !content.trim()) return;

        const avatarUrl = userData?.avatarUrl ? userData?.avatarUrl : userData?.username.toUpperCase().charAt(0);

        content = content.replace(/^\n+/, "");
        socket.emit('chat msg', { chatId, content, time, avatarUrl });
        setMsgData((prevData) => [...prevData, { content: content, name: userData.username, time: time, avatarUrl: avatarUrl }]);//----------------------------
        console.log(socket.id);
        console.log("msg emmited");
        input.current.value = "";
    }

    function handleChange(event) {
        console.log("handleChange running...");
        setMessageText(event.target.value);

        if (!isTyping && chatId) {
            setIsTyping(true);
            socket.emit("typing status", { username: userData.username, status: "typing", chatId });
        }
    }

    function toggleConnection() {
        if (socketStatus) {
            socket.disconnect();
            console.log("status:", socket.connected);
            setSocketStatus(false);
        }
        else {
            socket.connect();
            console.log("status:", socket.connected);
            setSocketStatus(true);
        }
    }

    function scrollToBottom() {
        bottomInChat.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    function useDebounce(value, delay = 500) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const timer = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(timer);
        }, [value, delay]);

        return debouncedValue;
    }

    const debouncedText = useDebounce(messageText, 600);


    useEffect(() => {
        scrollToBottom();
    }, [msgData, typingUser]);

    useEffect(() => {
        if (isTyping && chatId) {
            socket.emit("typing status", { chatId, username: userData.username, status: "stop" });
            setIsTyping(false);
        }
    }, [debouncedText]);



    useEffect(() => {


        // messages.current.innerHTML = "";
        setMsgData([])
        const getChatMessages = async () => {
            const response = await axios.get(`${backendUrl}/chat-messages?chatId=${chatId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            }).catch((e)=>{
            if(e){
              navigate("/signin");
            }
        })
            const messagesData = response.data.messages;
            const chatData = response.data.chat;
            // console.log(messagesData);
            console.log("the chat data is :", chatData);
            messagesData?.map((message) => {
                setMsgData(
                    (prevData) => ([...prevData, { content: message.content, name: message.sender.username, time: message.createdAt, avatarUrl: message.avatarUrl }])
                )
            })
            setChatData(chatData);
        }

        getChatMessages();


    }, [chatId, socketStatus])

    useEffect(() => {


        socket.connect();

        console.log(socket.id);

        const handleChatMessage = ({ chatId, content, sender, time, avatarUrl }) => {
            console.log(socket.id);
            console.log("the broadcasted message is : ", content);
            msgData.map((data) => { console.log(data) });
            setMsgData((prevData) => ([...prevData, { content: content, name: sender, time: time, avatarUrl: avatarUrl }]));
            // const item = document.createElement('p');
            // item.textContent = name +"-"+msg+`\n${time}`;
            // messages.current.appendChild(item);
        }

        socket.on('chat message', handleChatMessage);

        const handleTypingStatus = ({ username, status }) => {
            console.log(username + " is typing...");
            if (status === "typing") {
                setTypingUser(username);
            } else {
                setTypingUser(null);
            }
        }

        socket.on('typ status', handleTypingStatus);

        return () => {
            socket.off('chat message', handleChatMessage);
            socket.off('typ status', handleTypingStatus);
            socket.disconnect();
        };
    }, [])


    const otherUsername = (chat) => {
        if (chat === null) return;
        const chatName = chat.name;
        // console.log(chat);
        const names = chatName.split("-");
        return names[0] == userData.username ? names[1] : names[0];
    }

    const otherUserAvatarUrl = (chat) => {
        if (chat === null) return;
        if (chat.isGroup) return;
        const otherusername = otherUsername(chat);
        return chat.participants[0].username === otherusername ? chat.participants[0].avatarUrl : chat.participants[1].avatarUrl;
    }

    const otherDisplayname = (chat) => {
        if (chat === null) return;
        const participants = chat.participants;
        return participants[0].displayName == userData.displayName ? participants[1].displayName : participants[0].displayName;
    }

    const otherUsernameList = (chat) => {
        return (
            <>
                <span className={"text-primary"}>
                    {otherOnlineUsernameList(chat)}
                </span>
                <span className={""}>
                    {otherOfflineUsernameList(chat)}
                </span>
            </>
        )
    }

    const otherOnlineUsernameList = (chat) => {
        const participants = chat.participants;
        let onlineRes = [];
        for (const participant of participants) {
            if (onlineUsersList.includes(participant.username) && participant.username !== userData.username) {
                onlineRes.push(participant.username.toString() + " ");
            }
        }
        console.log(onlineRes);
        return onlineRes;
    }

    const otherOfflineUsernameList = (chat) => {
        const participants = chat.participants;
        let offlineRes = [];
        for (const participant of participants) {
            if (!onlineUsersList.includes(participant.username)) {
                offlineRes.push(participant.username.toString() + " ");
            }
        }
        offlineRes.push(userData.username);
        console.log(offlineRes);
        return offlineRes;
    }

    const isOnline = (chat) => {
        const name = otherUsername(chat);
        return onlineUsersList.includes(name);
    }




    return (
        <>

    <div className={"h-screen gap-0 grid grid-rows-[auto_1fr_auto] max-sm:max-w-[100vw]"}>
            <Item className={"py-1 max-sm:grid max-sm:grid-rows-2 max-sm:grid-cols-4 "}>
                    <ItemMedia className={"max-sm:col-span-1"}>
                        {isMobile && <Button variant='ghost' onClick={onBack}><ArrowLeft/></Button>}
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Avatar className={"h-[7vh] w-[7vh] object-cover cursor-pointer"}>
                                    <AvatarImage src={otherUserAvatarUrl(chatData)} />
                                    <AvatarFallback className={chatData?.isGroup ? "bg-border  flex items-center justify-center font-semibold text-xl" : "bg-border flex items-center justify-center font-semibold text-xl"}>{chatData?.isGroup ? <UsersRound /> : otherDisplayname(chatData)?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-surface">
                                <AlertDialogHeader className="flex items-center">
                                    <Avatar className="w-50 h-50 md:w-100 md:h-100 object-cover rounded-full mx-auto">
                                        <AvatarImage src={otherUserAvatarUrl(chatData)} />
                                        <AvatarFallback className={chatData?.isGroup ? "bg-border  flex items-center justify-center font-semibold text-8xl md:text-[200px]" : "bg-border flex items-center justify-center font-semibold text-8xl md:text-[200px]"}>{chatData?.isGroup ? <UsersRound className="w-[94px] h-[94px] md:w-[170px] md:h-[170px]" /> : otherDisplayname(chatData)?.charAt(0).toUpperCase()}</AvatarFallback>
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
                    {
                        chatData ?
                        <ItemContent className={"max-sm:col-span-3 truncate"}>
                            <ItemTitle className={"text-xl ml-4 text-text  truncate"}>{chatData?.isGroup ? chatData.name : otherDisplayname(chatData)}</ItemTitle>
                            <ItemDescription className={`ml-4 truncate ${isOnline(chatData) ? "text-primary" : ""}`}>{chatData?.isGroup ? otherUsernameList(chatData) : isOnline(chatData) ? `${otherUsername(chatData)} is online` : `${otherUsername(chatData)} is offline`}</ItemDescription>
                        </ItemContent>
                        :
                        <div className={"max-sm:col-span-3 truncate"}>
                            <Skeleton className="max-sm:ml-4 max-sm:mb-1 ml-4 h-7 w-[250px] bg-surface" />
                            <Skeleton className={"max-sm:ml-4 mt-2 ml-4 h-4 w-[150px] bg-surface"}/>
                        </div>
                    }
                    <ItemContent className="max-sm:col-span-2">
                        <ItemDescription >socket status: <span className={`${socketStatus ? "text-primary/80" : "text-danger/70"}`}>{socketStatus ? "connected" : "disconnected"}</span></ItemDescription>
                    </ItemContent>
                    <ItemActions className="max-sm:col-span-2">
                        <Button variant="outline" className={`${socketStatus ? "bg-danger/70" : "bg-primary/80"}`} onClick={toggleConnection}>
                            {socketStatus ? "disconnect from socket" : "connect to socket"}
                        </Button>
                    </ItemActions>

        </Item>
        <div ref={messages} className={" overflow-y-scroll px-2 md:px-0"} >
            {msgData.map((data, idx) => (
                <div key={idx} className={`flex my-1.5 ${userData.username === data.name ? "justify-end" : "justify-start"}`}>
                    <Messages sendBy={data.name} data={data.content} time={data.time} avatarUrl={data.avatarUrl} isSender={data.name === userData.username} />
                </div>
            ))}
            {typingUser && typingUser !== userData.username && (
                <p className="text-sm text-primary px-2 pb-2">
                    {typingUser} is typing...
                </p>
            )}
            <div ref={bottomInChat} />
        </div>
        <div className={"flex items-end px-2 md:px-0 mb-2 w-full min-w-0"}>
            <Textarea rows={1} placeholder="Type your message here." className={"flex-1 resize-none overflow-y-auto whitespace-pre-wrap break-words mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-1"} ref={input} onKeyDown={handleKeyDown} onChange={(e) => {
      handleChange(e);

      // auto-grow
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 70)}px`;
    }} />
            <Button onClick={submit} variant="ghost" className={"my-auto self-end mx-2 bg-primary/60 hover:bg-primary/80"}>Send</Button>
        </div>

    </div>
        </>
    )
}