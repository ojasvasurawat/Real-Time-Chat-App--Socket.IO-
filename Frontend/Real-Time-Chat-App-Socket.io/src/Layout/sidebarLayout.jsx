import AppSidebar from "@/components/appSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function SidebarLayout({passingDataToHome, passingProfileStatusToHome, children }) {

  const handleDataFromSidebar = (chatId, userData)=>{
      passingDataToHome(chatId, userData);
  }

  const hadleProfileStatusFromSidebar = (profileStatus)=>{
      passingProfileStatusToHome(profileStatus);
  }
  return (
    <SidebarProvider>
      <AppSidebar passingDataToLayout={handleDataFromSidebar} passingProfileStatusToLayout={hadleProfileStatusFromSidebar}/>
      <SidebarTrigger />
      <main className={"w-[50vw] mr-[1vw]"}>
        
        {children}
      </main>
    </SidebarProvider>
  )
}