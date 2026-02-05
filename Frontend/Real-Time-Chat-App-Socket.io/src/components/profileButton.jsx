import {
  SidebarMenuButton
} from "@/components/ui/sidebar"
import { User } from 'lucide-react';
import {
    Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar"
import { Button } from "./ui/button";


export default function ProfileButton({sendProfileStatusToSidebar, userData}){

    const handleProfileClick = ()=>{
        sendProfileStatusToSidebar(true);
    }

    return(
        <>
            <Button asChild variant="ghost" className={"h-[5vh] m-0"} onClick={handleProfileClick}>
              <Item>
                <ItemMedia>
                  <Avatar className={"h-[4vh] w-[4vh]"}>
                    <AvatarImage src={userData?.avatarUrl} />
                    <AvatarFallback ><User/></AvatarFallback>
                  </Avatar>
                </ItemMedia>    
                <ItemContent >
                  <ItemTitle className={"text-lg font-normal"}>Profile</ItemTitle>
                </ItemContent>
              </Item>
            </Button>
        </>
    )
}