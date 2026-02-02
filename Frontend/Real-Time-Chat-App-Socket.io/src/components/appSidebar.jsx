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
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import AddChatButton from './addChatButton';
import { Field } from './ui/field';
import CreateGroupButton from './createGroupButton';
import ChatList from './chatList';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import ProfileButton from './profileButton';
import LogoutButton from './logoutButton';


export default function AppSidebar({passingDataToLayout, passingProfileStatusToLayout, onlineUsersList}) {

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
    <Sidebar collapsible={false} className="bg-surface text-white  flex flex-col" >
      <SidebarHeader className="px-4 py-3 flex flex-col gap-3">
        <h1 className={"text-xl font-bold"}>REAL TIME CHAT APP</h1>
        <Field orientation="horizontal" className={"flex justify-between items-center"}>
          <h2 className={"text-lg font-medium"}>HI {userData?.displayName}!</h2>
          <CreateGroupButton/>
        </Field>
        <AddChatButton />
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto px-2">
        <SidebarGroup>
            <SidebarGroupLabel className={"text-lg font-semibold mb-2"}>CHATS</SidebarGroupLabel>
            <SidebarGroupContent className={"overflow-y-scroll gap-1"}>
                <ChatList userData={userData} sendDataToParent={handleChatId} onlineUsersList={onlineUsersList}/>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3 flex gap-2 justify-between border-t border-border">  
          <ProfileButton userData={userData} sendProfileStatusToSidebar={handleProfileStatus}/>
          <LogoutButton/>
      </SidebarFooter> 
    </Sidebar>
  )
}