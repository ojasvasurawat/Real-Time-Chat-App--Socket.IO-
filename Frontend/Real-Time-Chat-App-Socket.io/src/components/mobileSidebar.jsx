import axios from 'axios';
import { useEffect, useState } from "react"
import AddChatButton from './addChatButton';
import { Field } from './ui/field';
import CreateGroupButton from './createGroupButton';
import ChatList from './chatList';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import ProfileButton from './profileButton';
import LogoutButton from './logoutButton';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";


export default function MobileSidebar({passingDataToHome, passingProfileStatusToHome, onlineUsersList}) {

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
      passingDataToHome(chatId, userData);
    }

    const handleProfileStatus = (profileStatus)=>{
      passingProfileStatusToHome(profileStatus);
    }

    if (!userData) return null;

  return (
    <Card className={"w-screen max-w-none h-screen gap-0 rounded-none border-0 py-0 shadow-none grid grid-rows-[auto_1fr_auto] gap-2 bg-surface text-white"}>
      <CardHeader className={"self-start px-4 mt-2 border-b border-white/10"}>
        <CardTitle className={"text-xl text-primary"}>REAL TIME CHAT APP</CardTitle>
        <Field orientation="horizontal" className={"flex justify-between"}>
          <h2 className={"text-lg text-gray-200"}>HI {userData?.displayName}!</h2>
          <CreateGroupButton />
        </Field>
        <AddChatButton/>
      </CardHeader>
      <CardContent className={"px-4"}>
            <CardDescription className={"text-lg text-gray-300"}>CHATS</CardDescription>
            <div className={"overflow-y-scroll bg-surface"}>
                <ChatList userData={userData} sendDataToParent={handleChatId} onlineUsersList={onlineUsersList}/>
            </div>
      </CardContent >
      <CardFooter className={"self-end px-4 gap-x-[25vw] mb-3  border-t border-white/10"}>
            <ProfileButton userData={userData} sendProfileStatusToSidebar={handleProfileStatus}/>
            <LogoutButton className="text-danger hover:bg-danger/10"/>
      </CardFooter > 
    </Card >
  );
}
