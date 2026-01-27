import axios from 'axios';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import AddChatButton from './addChatButton';
import { Field } from './ui/field';
import { Button } from './ui/button';
import CreateGroupButton from './createGroupButton';
import { Label } from './ui/label';
import ChatList from './chatList';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { User, LogOut } from 'lucide-react';
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
import ProfileButton from './profileButton';
import LogoutButton from './logoutButton';


export default function AppSidebar({passingDataToLayout, passingProfileStatusToLayout}) {

    const [userData, setUserData] = useState(null);

    useEffect(()=>{
        const userData = async ()=>{
            const response = await axios.get(`${backendUrl}/info`,{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            })
            // console.log("response is: ",response);
            // console.log("data is: ",response.data);
            setUserData(response.data.user);
        }

        userData()
    },[])

    const handleChatId = (chatId)=>{
      passingDataToLayout(chatId, userData);
    }

    const handleProfileStatus = (profileStatus)=>{
      passingProfileStatusToLayout(profileStatus);
    }

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className={"text-xl "}>REAL TIME CHAT APP</h1>
        <Field orientation="horizontal" className={"flex justify-between"}>
          <h2 className={"text-lg"}>HI {userData?.displayName}!</h2>
          <CreateGroupButton/>
        </Field>
        <AddChatButton />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className={"text-lg"}>CHATS</SidebarGroupLabel>
            <SidebarGroupContent className={"overflow-y-scroll"}>
                <ChatList userData={userData} sendDataToParent={handleChatId}/>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
          <SidebarMenuItem>
            <ProfileButton userData={userData} sendProfileStatusToSidebar={handleProfileStatus}/>
            <LogoutButton/>
          </SidebarMenuItem>
      </SidebarFooter> 
    </Sidebar>
  )
}