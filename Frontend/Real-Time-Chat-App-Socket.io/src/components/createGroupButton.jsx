import axios from "axios";
import { useState, useRef, useEffect } from "react"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { Field } from "./ui/field";
import { Users } from "lucide-react";
import { toast } from "react-toastify";


export default function CreateGroupButton({userData}){

    const [groupName, setGroupName] = useState("");
    const [chatUsernameList, setChatUsernameList] = useState([userData?.username]);
    const chatUsernameInput = useRef(null);
    const usernameListDiv = useRef(null);
    const groupNameInput = useRef(null);

    const handleAddUsername = ()=>{
        if(chatUsernameInput.current.value === "") return;
        console.log(chatUsernameList);
        setChatUsernameList([...chatUsernameList, chatUsernameInput.current.value]);
        chatUsernameInput.current.value = "";
    }

    const handelCancel = ()=>{
        setChatUsernameList([userData?.username]);
        setGroupName("");
    }

    const handleCreateGroup = async ()=>{
        if(groupName === ""){ 
            toast.warning("Please enter a group name");
            return;
        }
        if(chatUsernameList.length === 1){
            toast.warning("Add at least one participant to the group");
            return;
        }
        
        try{
            const response = await axios.post(`${backendUrl}/create-group`,{
                groupName: groupName,
                participantUsernames: chatUsernameList.slice(1)
            },{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });

            console.log(response);
            if(response.data.message){
                toast.warning(response.data.message);
                return;
            }
            else if(response.data.chat){
                toast.success(`Group ${response.data.chat.name} created successfully 🎉`)
                setTimeout(()=>{
                    window.location.reload();
                },5000);
            }
            handelCancel();
            
        }catch(error){

        }


    }
    
    return(
        <>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className={"bg-primary/70 border border-primary  hover:bg-primary/90 hover:shadow-md"} >Create Group</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className={"bg-surface"}>
                <AlertDialogHeader>
                <AlertDialogTitle className={"text-text"}>Enter usernames of users to add in group</AlertDialogTitle>
                <AlertDialogDescription className={"text-text"}>
                    Create a new group and add members.
                </AlertDialogDescription>
                <div className={"w-full"}>
                    <Input
                        type="groupName"
                        value={groupName}
                        onChange={(e)=>{setGroupName(e.target.value)}}
                        placeholder="Enter group name"
                        ref={groupNameInput}
                        className={"mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-0"}
                    />
                    <Field className={"flex gap-3"} orientation="horizontal">
                        <Input
                            type="chatUsername"
                            placeholder="Type a username to add in group"
                            ref={chatUsernameInput}
                            className={"focus:border-primary/60 focus:ring-0 focus-visible:ring-0"}
                        />
                        <Button variant="outline" className="text-primary/70 hover:text-white hover:bg-primary/70" onClick={handleAddUsername} >Add</Button>
                    </Field>
                    <Label className={"my-2 text-muted"}>Members including you</Label>
                    <Field ref={usernameListDiv} className={"overflow-y-auto h-[20vh] bg-background rounded-lg p-2"}>
                        {chatUsernameList.map((data, idx)=>(
                            <Label key={idx} className={"text-text/80"}>{data}</Label>
                        ))}
                    </Field>
                </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction variant="ghost" className={"bg-primary/80 border border-primary  hover:bg-primary hover:shadow-lg"} onClick={handleCreateGroup}>Create Group</AlertDialogAction>    
                    <AlertDialogCancel variant="ghost" className={"bg-danger/70 border border-danger  hover:bg-danger/90 hover:shadow-md"} onClick={handelCancel}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </>
    )
}