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
                <Button className={"p-1"} variant="outline">Create Group</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
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
                        <Button variant="outline" onClick={handleAddUsername} >Add</Button>
                    </Field>
                    <Label className={"my-2"}>Members with you</Label>
                    <Field ref={usernameListDiv} className={"overflow-y-scroll h-[20vh]"}>
                        {chatUsernameList.map((data, idx)=>(
                            <Label key={idx}>{data}</Label>
                        ))}
                    </Field>
                </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction variant="outline" onClick={handleCreateGroup}>Create Group</AlertDialogAction>    
                    <AlertDialogCancel onClick={handelCancel}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </>
    )
}