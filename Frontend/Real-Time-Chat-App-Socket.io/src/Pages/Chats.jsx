import axios from 'axios';
import { useState } from "react";
import AddChatButton from "../components/addChatButton";
import Chat from "../components/chat";
import ChatList from "../components/chatList";
import { useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Chats(){

    const [dataFromChild, setDataFromChild] = useState("");
    const [userData, setUserData] = useState(null);

    // Callback function to receive data from the child
    const handleChildData = (childData) => {
        setDataFromChild(childData);
    }

    useEffect(()=>{
        // handleChildData();
        console.log("the chat id is: "+dataFromChild);
    },[dataFromChild])

    useEffect(()=>{
        const userData = async ()=>{
            const response = await axios.get(`${backendUrl}/profile`,{
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

    return(
        <>
            <div>
                <AddChatButton/>
                <ChatList sendDataToParent={handleChildData} userData={userData}/>
            </div>
            <div>
                <Chat chatId={dataFromChild} userData={userData}/>
            </div>
        </>
    )
}