import axios from 'axios';
import Chat from "@/components/chat";
import SidebarLayout from "@/Layout/sidebarLayout";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import Profile from './Profile';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from '@/components/mobileSidebar';
import { ToastContainer } from 'react-toastify';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default function Home(){

    const [chatState, setChatState] = useState(false);
    const [profileState, setProfileState] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [onlineUsersList, setOnlineUsersList] = useState([]);
    const [chatList, setChatList] = useState([]);

    const isMobile = useIsMobile();
    const [mobileState, setMobileState] = useState("sidebar");

    const handleDataFromLayout = (chatId, userData)=>{
        // console.log("the chat id form deep of the deep is : ",chatId);
        // console.log("the userData form deep is : ",userData);
        setChatId(chatId);
        setUserData(userData);
        setChatState(true);
        setProfileState(false);
        setMobileState("chat");
    }

    const handleProfileStatusFromLayout = (profileStatus)=>{
        console.log("the profile status from the deep of the deep is :", profileStatus);
        setProfileState(profileStatus);
        setChatState(false);
        setMobileState("profile");
    }

    useEffect(()=>{

        socket.connect();

        const handleOnlineUsers = (onlineUserList)=>{
            console.log("online user list is",onlineUserList);
            setOnlineUsersList(onlineUserList);
        }

        socket.on("online users", handleOnlineUsers);

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
        // fetchChatList();

        return ()=>{
            socket.off('online users', handleOnlineUsers);
            socket.disconnect();
        };
    },[])

    if(!isMobile){
        return(
            <>
            <ToastContainer/>
                <SidebarLayout passingDataToHome={handleDataFromLayout} passingProfileStatusToHome={handleProfileStatusFromLayout} onlineUsersList={onlineUsersList}>
                    {chatState && <Chat chatId={chatId} userData={userData} onlineUsersList={onlineUsersList}/>}
                    {profileState && <Profile/>}
                </SidebarLayout>
            </>
        )
    }
    return(
        <>
        <ToastContainer/>
            {mobileState==="sidebar" && <MobileSidebar passingDataToHome={handleDataFromLayout} passingProfileStatusToHome={handleProfileStatusFromLayout} onlineUsersList={onlineUsersList}/>}
            {mobileState==="chat" && <Chat chatId={chatId} userData={userData} onlineUsersList={onlineUsersList} onBack={()=> setMobileState("sidebar")}/>}
            {mobileState==="profile" && <Profile onBack={()=> setMobileState("sidebar")}/>}
        </>
    )
    
}