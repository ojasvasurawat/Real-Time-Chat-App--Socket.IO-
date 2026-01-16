import axios from "axios";
import { useState, useRef } from "react"
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default function AddChatButton(){

    const [chatUsername, setChatUsername] = useState("");
    const chatUsernameInput = useRef(null);

    const handleAddChat = async()=>{
        const response = await axios.post(`${backendUrl}/add-chat`,{
            chatUsername: chatUsername
        },{
            headers:{
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authorization')
            }
        });

        if(response){
            chatUsernameInput.current.value=""
        }
    }
    return(
        <>
            <input
                id="chatUsername"
                type="chatUsername"
                value={chatUsername}
                onChange={(e)=>{setChatUsername(e.target.value)}}
                placeholder="Type a username to add a chat"
                ref={chatUsernameInput}
            />
            <button onClick={handleAddChat}>Add Chat</button>
        </>
    )
}