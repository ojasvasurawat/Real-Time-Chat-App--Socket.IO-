import axios from "axios";
import { useState, useRef } from "react"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function AddChatButton(){

    const [chatUsername, setChatUsername] = useState("");
    const chatUsernameInput = useRef(null);

    const navigate = useNavigate();

    const handleAddChat = async()=>{

        try{
            const response = await axios.post(`${backendUrl}/add-chat`,{
                chatUsername: chatUsername
            },{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            }).catch((e)=>{
            if(e){
              navigate("/signin");
            }
        });

            // console.log(response);

            if(response.data.message){
                chatUsernameInput.current.value=""
                toast.warning(response.data.message);
                return;
            }
            else if(response.data.chat){
                chatUsernameInput.current.value=""
                toast.success("Chat created successfully 🎉");
                // setTimeout(()=>{
                //     window.location.reload();
                // },5000)
                window.location.reload();
            }
        }catch(error){
        
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
                    className={"focus:border-primary/60 focus:ring-0 focus-visible:ring-0"}
                />
                <Button onClick={handleAddChat}  variant="outline" className={"bg-primary/70 border border-primary  hover:bg-primary/90 hover:shadow-md"}>Add Chat</Button>
            </Field>
        </>
    )
}