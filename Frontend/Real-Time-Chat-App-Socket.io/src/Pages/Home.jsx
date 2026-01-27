import Chat from "@/components/chat";
import SidebarLayout from "@/Layout/sidebarLayout";
import { useState } from "react";

export default function Home(){

    const [chatState, setChatState] = useState(false);
    const [profileState, setProfileState] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [userData, setUserData] = useState(null);

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
        setProfileState(profileState);
        setChatState(false);
    }

    return(
        <>
            <SidebarLayout passingDataToHome={handleDataFromLayout} passingProfileStatusToHome={handleProfileStatusFromLayout}>
                {chatState && <Chat chatId={chatId} userData={userData}/>}
            </SidebarLayout>
        </>
    )
}