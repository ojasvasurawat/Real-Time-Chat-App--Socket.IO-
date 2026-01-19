import { useState } from "react";
import AddChatButton from "../components/addChatButton";
import Chat from "../components/chat";
import ChatList from "../components/chatList";
import { useEffect } from "react";

export default function Chats(){

    const [dataFromChild, setDataFromChild] = useState("");

    // Callback function to receive data from the child
    const handleChildData = (childData) => {
        setDataFromChild(childData);
    }

    useEffect(()=>{
        // handleChildData();
        console.log("the chat id is: "+dataFromChild);
    },[dataFromChild])

    return(
        <>
            <div>
                <AddChatButton/>
                <ChatList sendDataToParent={handleChildData}/>
            </div>
            <div>
                <Chat chatId={dataFromChild}/>
            </div>
        </>
    )
}