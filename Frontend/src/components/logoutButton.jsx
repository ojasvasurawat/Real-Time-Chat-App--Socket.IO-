import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { LogOut } from 'lucide-react';
import {
    Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function LogoutButton(){

    const navigate = useNavigate();

    const handleLogout = async ()=>{
        try{
            const response = await axios.post(`${backendUrl}/logout`,{
                
            },{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            })
        if (response) {
            localStorage.setItem("authorization", "");
            // toast.success("Logout successfully");
            navigate("/signin");
        }
        else{
            // toast.error("Logout Failed")
        }
        }catch(e){
            // console.log("the error is :",e);
        }
    }

    return(
        <>
        <div className="max-sm:bg-danger/60 hover:bg-surface rounded-lg pb-1">
            <Button asChild variant="ghost" className={"h-[5vh] m-0 w-full "} onClick={handleLogout}>
              <Item>
                <ItemMedia>
                  <Avatar className={"h-[4vh] w-[4vh] object-cover"}>
                    <AvatarFallback className={"bg-transparent"}><LogOut/></AvatarFallback>
                  </Avatar>
                </ItemMedia>    
                <ItemContent >
                  <ItemTitle className={"text-lg font-normal"}>Logout</ItemTitle>
                </ItemContent>
              </Item>
            </Button>
        </div>
        </>
    )
}