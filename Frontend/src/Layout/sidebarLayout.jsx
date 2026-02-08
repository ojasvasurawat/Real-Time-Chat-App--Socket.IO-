import AppSidebar from "@/components/appSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function SidebarLayout({passingDataToHome, passingProfileStatusToHome, onlineUsersList, children }) {

  const handleDataFromSidebar = (chatId, userData)=>{
      passingDataToHome(chatId, userData);
  }

  const hadleProfileStatusFromSidebar = (profileStatus)=>{
      passingProfileStatusToHome(profileStatus);
  }
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar passingDataToLayout={handleDataFromSidebar} passingProfileStatusToLayout={hadleProfileStatusFromSidebar} onlineUsersList={onlineUsersList}/>
      <main className={"grow px-2 bg-background"}>
        {children}
      </main>
    </SidebarProvider>
  )
}