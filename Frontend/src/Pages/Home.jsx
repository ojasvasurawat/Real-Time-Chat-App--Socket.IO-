import SidebarLayout from "@/Layout/sidebarLayout";
import React, { useEffect, useState } from "react";
const Chat = React.lazy(()=> import("@/components/chat"))
import { socket } from "../socket";
import Profile from './Profile';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from '@/components/mobileSidebar';
import {  ToastContainer } from 'react-toastify';


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
        window.history.pushState({ page: "chat" }, "");
        setMobileState("chat");
    }

    const handleProfileStatusFromLayout = (profileStatus)=>{
        // console.log("the profile status from the deep of the deep is :", profileStatus);
        setProfileState(profileStatus);
        setChatState(false);
        window.history.pushState({ page: "profile" }, "");
        setMobileState("profile");
    }


    const handleBack = () => {
        setMobileState((prev) => {
            if (prev === "chat" || prev === "profile") {
            return "sidebar";
            }
            return prev; // sidebar stays sidebar
        });
    };


    useEffect(()=>{

        socket.connect();

        window.history.replaceState({ page: "sidebar" }, "");

        const handleOnlineUsers = (onlineUserList)=>{
            // console.log("online user list is",onlineUserList);
            setOnlineUsersList(onlineUserList);
        }

        socket.on("online users", handleOnlineUsers);



        const handlePopState = () => {
            handleBack();
        };

        window.addEventListener("popstate", handlePopState);




        return ()=>{
            socket.off('online users', handleOnlineUsers);
            socket.disconnect();
            window.removeEventListener("popstate", handlePopState);
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
            {mobileState==="chat" && <Chat chatId={chatId} userData={userData} onlineUsersList={onlineUsersList} onBack={handleBack}/>}
            {mobileState==="profile" && <Profile onBack={handleBack}/>}
        </>
    )
    
}