// import axios from 'axios';
// import { useState } from "react";
// import AddChatButton from "../components/addChatButton";
// import Chat from "../components/chat";
// import ChatList from "../components/chatList";
// import { useEffect } from "react";
// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// import {User, LogOut} from "lucide-react";

// import { SidebarProvider, 
//     SidebarTrigger, 
//     Sidebar, 
//     SidebarContent, 
//     SidebarFooter, 
//     SidebarGroup, 
//     SidebarHeader,
//     SidebarGroupContent,
//     SidebarMenu,
//     SidebarMenuItem,
//     SidebarMenuButton } from "@/components/ui/sidebar"
// import { Label } from '@/components/ui/label';


// export default function Chats(){

//     const [dataFromChild, setDataFromChild] = useState("");
//     const [userData, setUserData] = useState(null);
//     // const navigate = useNavigate();

//     // Callback function to receive data from the child
//     const handleChildData = (childData) => {
//         setDataFromChild(childData);
//     }

//     useEffect(()=>{
//         // handleChildData();
//         console.log("the chat id is: "+dataFromChild);
//     },[dataFromChild])

//     useEffect(()=>{
//         const userData = async ()=>{
//             const response = await axios.get(`${backendUrl}/info`,{
//                 headers:{
//                     'Content-Type': 'application/json',
//                     'authorization': localStorage.getItem('authorization')
//                 }
//             })
//             // console.log("response is: ",response);
//             // console.log("data is: ",response.data);
//             setUserData(response.data.user);
//         }

//         userData()
//     },[])

    
//     const handleLogout = async()=>{
//         try{const response = await axios.post(`${backendUrl}/logout`,{
                
//             },{
//                 headers:{
//                     'Content-Type': 'application/json',
//                     'authorization': localStorage.getItem('authorization')
//                 }
//             })
//         if (response) {
//             localStorage.setItem("authorization", "");
//             // toast.success("Logout successfully");
//             navigate("/signin");
//         }
//         else{
//             // toast.error("Logout Failed")
//         }
//         }catch(e){
//             console.log("the error is :",e);
//         }
//     }

//     return(
//         <>

//         <SidebarProvider>
//             <Sidebar>
//             <SidebarHeader>
//                 <SidebarMenu>
//                     <SidebarMenuItem>REAL TIME CHAT APP</SidebarMenuItem>
//                     <SidebarMenuItem>HI {userData?.displayName}!</SidebarMenuItem>
//                     <SidebarMenuItem>
//                         <AddChatButton/>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarHeader>
//             <SidebarContent>
//                 <Label>CHATS</Label>
//                 <SidebarGroup />
//                     <SidebarGroupContent>
//                         <ChatList sendDataToParent={handleChildData} userData={userData}/>
//                     </SidebarGroupContent>
//                 <SidebarGroup />
//             </SidebarContent>
//             <SidebarFooter>
//                 <SidebarMenuButton asChild>
//                 <a href="/profile">
//                 {userData?.avatarUrl ? <img className="w-5 h-5 object-cover rounded-full" src={avatarUrl}/> : <User/>}
//                     {/* <User/><img className="w-5" src={avatarUrl}/> */}
//                     <span>Profile</span>
//                 </a>
//                 </SidebarMenuButton>
//                 <SidebarMenuButton asChild>
//                 <div onClick={handleLogout}>
//                     <LogOut />
//                     <span>Log out</span>
//                 </div>
//                 </SidebarMenuButton>
//             </SidebarFooter>
//             </Sidebar>
//             <main>
//                 <SidebarTrigger />
//                 <Chat chatId={dataFromChild} userData={userData}/>
//             </main>
//         </SidebarProvider>
//         </>
//     )
// }