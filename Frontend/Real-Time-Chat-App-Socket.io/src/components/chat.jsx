import axios from 'axios';
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { socket } from "../socket";
import { useLocation } from "react-router-dom";
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

import { UsersRound } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';



export default function Chat({ chatId, userData, onlineUsersList }) {

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
                <span className={"text-blue-400"}>
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

    <div >
            <Item>
                    <ItemMedia>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Avatar className={"h-[7vh] w-[7vh]"}>
                                    <AvatarImage src={otherUserAvatarUrl(chatData)} />
                                    <AvatarFallback className={chatData?.isGroup ? "bg-gray-400  flex items-center justify-center font-semibold text-xl" : "bg-gray-600 flex items-center justify-center font-semibold text-xl"}>{chatData?.isGroup ? <UsersRound /> : otherDisplayname(chatData)?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-surface">
                                <AlertDialogHeader className="flex items-center">
                                    <Avatar className="w-50 h-50 md:w-100 md:h-100 rounded-full mx-auto">
                                        <AvatarImage src={otherUserAvatarUrl(chatData)} />
                                        <AvatarFallback className={chatData?.isGroup ? "bg-gray-400  flex items-center justify-center font-semibold text-8xl md:text-[200px]" : "bg-gray-600 flex items-center justify-center font-semibold text-8xl md:text-[200px]"}>{chatData?.isGroup ? <UsersRound className="w-[94px] h-[94px] md:w-[170px] md:h-[170px]" /> : otherDisplayname(chatData)?.charAt(0).toUpperCase()}</AvatarFallback>
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
                    <ItemContent className={"min-w-0"}>
                        <ItemTitle className={"text-xl ml-4  truncate"}>{chatData?.isGroup ? chatData.name : otherDisplayname(chatData)}</ItemTitle>
                        <ItemDescription className={`ml-4 truncate ${isOnline(chatData) ? "text-blue-400" : ""}`}>{chatData?.isGroup ? otherUsernameList(chatData) : isOnline(chatData) ? `${otherUsername(chatData)} is online` : `${otherUsername(chatData)} is offline`}</ItemDescription>
                    </ItemContent>
                    <ItemContent className="hidden sm:block">
                        <ItemDescription>socket status: {socketStatus ? "connected" : "disconnected"}</ItemDescription>
                    </ItemContent>
                    <ItemActions className="hidden sm:flex">
                        <Button variant="outline" onClick={toggleConnection}>
                            {socketStatus ? "disconnect from socket" : "connect to socket"}
                        </Button>
                    </ItemActions>
            

            <div className="mt-2 flex items-center justify-between gap-3 sm:hidden">
                <ItemDescription className="text-sm">
                    socket: {socketStatus ? "connected" : "disconnected"}
                </ItemDescription>

                <Button size="sm" variant="outline" onClick={toggleConnection}>
                    {socketStatus ? "Disconnect" : "Connect"}
                </Button>
            </div>

        </Item>
        <div ref={messages} className={" overflow-y-scroll px-2 md:px-0"} >
            {msgData.map((data, idx) => (
                <div key={idx} className={`flex my-1.5 ${userData.username === data.name ? "justify-end" : "justify-start"}`}>
                    <Messages sendBy={data.name} data={data.content} time={data.time} avatarUrl={data.avatarUrl} isSender={data.name === userData.username} />
                </div>
            ))}
            {typingUser && typingUser !== userData.username && (
                <p className="text-sm text-blue-400 px-2">
                    {typingUser} is typing...
                </p>
            )}
            <div ref={bottomInChat} />
        </div>
        <div className={"flex px-2 md:px-0 mb-2"}>
            <Textarea type="text" placeholder="Type your message here." className={""} ref={input} onKeyDown={handleKeyDown} onChange={handleChange} />
            <Button onClick={submit} variant="outline" className={"my-auto mx-2"}>Send</Button>
        </div>

    </div>
        </>
    )
}