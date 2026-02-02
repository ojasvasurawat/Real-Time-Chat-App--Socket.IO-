import axios from 'axios';
import Chat from "@/components/chat";
import SidebarLayout from "@/Layout/sidebarLayout";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import Profile from './Profile';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default function Home(){

    const [chatState, setChatState] = useState(false);
    const [profileState, setProfileState] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [onlineUsersList, setOnlineUsersList] = useState([]);
    const [chatList, setChatList] = useState([]);

    const handleDataFromLayout = (chatId, userData)=>{
        // console.log("the chat id form deep of the deep is : ",chatId);
        // console.log("the userData form deep is : ",userData);
        setChatId(chatId);
        setUserData(userData);
        setChatState(true);
        setProfileState(false);
    }

    const handleProfileStatusFromLayout = (profileStatus)=>{
        console.log("the profile status from the deep of the deep is :", profileStatus);
        setProfileState(profileStatus);
        setChatState(false);
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
        fetchChatList();

        return ()=>{
            socket.off('online users', handleOnlineUsers);
            socket.disconnect();
        };
    },[])

    return(
        <>
<<<<<<< HEAD
            <div className="h-screen w-max-screen bg-background text-white">
                {mobileScreen === "sidebar" && (<MobileSidebar passingDataToHome={handleDataFromLayout} passingProfileStatusToHome={handleProfileStatusFromLayout} onlineUsersList={onlineUsersList} chatList={chatList}/>)}
                {mobileScreen !== "sidebar" && (
                    <main className={"flex-1 overflow-auto"}>
                        {mobileScreen === "chat" && (<Chat chatId={chatId} userData={userData} onlineUsersList={onlineUsersList} onBack={()=> setMobileScreen("sidebar")} />)}
                        {mobileScreen === "profile" && (<Profile onBack={()=> setMobileScreen("sidebar")} />)}
                    </main>
                )}
            </div>
=======
            <SidebarLayout passingDataToHome={handleDataFromLayout} passingProfileStatusToHome={handleProfileStatusFromLayout} onlineUsersList={onlineUsersList}>
                {chatState && <Chat chatId={chatId} userData={userData} onlineUsersList={onlineUsersList}/>}
                {profileState && <Profile/>}
            </SidebarLayout>
>>>>>>> parent of f64b16e (mobile sidebar added)
        </>
    )
}