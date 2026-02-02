import axios from "axios";
import { useState, useRef } from "react"
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


export default function CreateGroupButton(){

    const [groupName, setGroupName] = useState("");
    const [chatUsernameList, setChatUsernameList] = useState([]);
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
        setChatUsernameList([]);
        setGroupName("");
    }

    const handleCreateGroup = async ()=>{
        if(groupName === "") return;

        const response = await axios.post(`${backendUrl}/create-group`,{
            groupName: groupName,
            participantUsernames: chatUsernameList
        },{
            headers:{
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authorization')
            }
        });

        console.log(response.data);
        handelCancel();


    }
    
    return(
        <>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className={"border-primary text-primary hover:bg-primary/10"}>Create Group</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className={"bg-surface text-white border border-white/10"}>
                <AlertDialogHeader>
                <AlertDialogTitle>Enter usernames of users to add in group</AlertDialogTitle>
                <AlertDialogDescription>
                    Create a new group and add members.
                </AlertDialogDescription>
                <div className={"w-full"}>
                    <Input
                        type="groupName"
                        value={groupName}
                        onChange={(e)=>{setGroupName(e.target.value)}}
                        placeholder="Enter group name"
                        ref={groupNameInput}
                        className={"mb-2"}
                    />
                    <Field className={"flex gap-3"} orientation="horizontal">
                        <Input
                            type="chatUsername"
                            placeholder="Type a username to add in group"
                            ref={chatUsernameInput}
                        />
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={handleAddUsername} >Add</Button>
                    </Field>
                    <Label className={"my-2"}>Members including you</Label>
                    <Field ref={usernameListDiv} className={"overflow-y-auto h-[20vh] bg-background rounded-md p-2"}>
                        {chatUsernameList.map((data, idx)=>(
                            <Label key={idx}>{data}</Label>
                        ))}
                    </Field>
                </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className="bg-primary hover:bg-primary/90 text-white" onClick={handleCreateGroup}>Create Group</AlertDialogAction>    
                    <AlertDialogCancel onClick={handelCancel} className="border border-white/20 text-gray-300 hover:bg-white/10">Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </>
    )
}