import axios from 'axios';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import AddChatButton from './addChatButton';
import { Field } from './ui/field';
import CreateGroupButton from './createGroupButton';
import ChatList from './chatList';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import ProfileButton from './profileButton';
import LogoutButton from './logoutButton';
import { useNavigate } from 'react-router-dom';


export default function AppSidebar({passingDataToLayout, passingProfileStatusToLayout, onlineUsersList}) {

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate()

    useEffect(()=>{

      try{
        const userData = async ()=>{
            const response = await axios.get(`${backendUrl}/info`,{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            }).catch((e)=>{
            if(e){
              navigate("/signin");
            }
        })
            // console.log("response is: ",response);
            // console.log("data is: ",response.data);
            if(response.data.message === "no token found"){
              navigate("/signin");
            }
            setUserData(response.data.user);
        }

        userData();
      }catch(e){
      
      }
    },[])

    const handleChatId = (chatId)=>{
      passingDataToLayout(chatId, userData);
    }

    const handleProfileStatus = (profileStatus)=>{
      passingProfileStatusToLayout(profileStatus);
    }

  return (
    <Sidebar className={"bg-background "} >
      <SidebarHeader>
        <h1 className={"text-xl text-text"}>REAL TIME CHAT APP</h1>
        <Field orientation="horizontal" className={"flex justify-between"}>
          <h2 className={"text-lg text-text"}>HI {userData?.displayName}!</h2>
          {userData && <CreateGroupButton userData={userData} />}
        </Field>
        <AddChatButton />
      </SidebarHeader>
      <SidebarContent className="px-2 overflow-y-scroll">
        <SidebarGroup>
            <SidebarGroupLabel className={"text-lg font-semibold mb-2 text-text"}>CHATS</SidebarGroupLabel>
            <SidebarGroupContent className={"  gap-1"}>
                <ChatList userData={userData} sendDataToParent={handleChatId} onlineUsersList={onlineUsersList}/>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
        <SidebarFooter className="gap-0">  
            <ProfileButton userData={userData} sendProfileStatusToSidebar={handleProfileStatus}/>
            <LogoutButton/>
        </SidebarFooter> 
    </Sidebar>
  )
}