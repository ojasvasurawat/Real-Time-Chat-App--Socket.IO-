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
    <Card className={"w-screen max-w-none h-screen"}>
      <CardHeader>
        <CardTitle className={"text-xl "}>REAL TIME CHAT APP</CardTitle>
        <Field orientation="horizontal" className={"flex justify-between"}>
          <h2 className={"text-lg"}>HI {userData?.displayName}!</h2>
          <CreateGroupButton/>
        </Field>
        <AddChatButton />
      </CardHeader>
      <CardContent >
            <CardDescription className={"text-lg"}>CHATS</CardDescription>
            <div className={"overflow-y-scroll"}>
                <ChatList userData={userData} sendDataToParent={handleChatId} onlineUsersList={onlineUsersList}/>
            </div>
      </CardContent >
      <CardFooter >
            <ProfileButton userData={userData} sendProfileStatusToSidebar={handleProfileStatus}/>
            <LogoutButton/>
      </CardFooter > 
    </Card >
  );
}
