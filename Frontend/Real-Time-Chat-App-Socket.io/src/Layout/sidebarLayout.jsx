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
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}