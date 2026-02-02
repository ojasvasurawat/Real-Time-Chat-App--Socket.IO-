import axios from "axios";
import { useState, useRef, useEffect } from "react"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"


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
            <Field orientation="horizontal">
                <Input
                    id="chatUsername"
                    type="chatUsername"
                    value={chatUsername}
                    onChange={(e)=>{setChatUsername(e.target.value)}}
                    placeholder="Type a username to add a chat"
                    ref={chatUsernameInput}
                />
                <Button onClick={handleAddChat}  className="bg-primary hover:bg-primary/90 text-white">Add Chat</Button>
            </Field>
        </>
    )
}