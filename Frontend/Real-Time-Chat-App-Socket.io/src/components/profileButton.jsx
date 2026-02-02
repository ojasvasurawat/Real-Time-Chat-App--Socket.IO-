import { Button } from "@/components/ui/button";
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
            <Button variant="ghost" asChild className={"h-[7vh] m-0 text-white hover:bg-white/10 "} onClick={handleProfileClick}>
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