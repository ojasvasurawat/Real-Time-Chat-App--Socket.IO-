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

export default function ProfileButton({sendProfileStatusToSidebar, userData}){

    const handleProfileClick = ()=>{
        sendProfileStatusToSidebar(true);
    }

    return(
        <>
            <SidebarMenuButton asChild className={"h-[5vh] m-0"} onClick={handleProfileClick}>
              <Item>
                <ItemMedia>
                  <Avatar className={"h-[3vh] w-[3vh]"}>
                    <AvatarImage src={userData?.avatarUrl} />
                    <AvatarFallback ><User/></AvatarFallback>
                  </Avatar>
                </ItemMedia>    
                <ItemContent >
                  <ItemTitle className={"text-lg font-normal"}>Profile</ItemTitle>
                </ItemContent>
              </Item>
            </SidebarMenuButton>
        </>
    )
}