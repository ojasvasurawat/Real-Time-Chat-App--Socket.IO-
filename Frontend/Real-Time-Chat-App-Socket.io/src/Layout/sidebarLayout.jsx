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
      <div className="flex h-screen bg-background text-white w-screen">
        <AppSidebar passingDataToLayout={handleDataFromSidebar} passingProfileStatusToLayout={hadleProfileStatusFromSidebar} onlineUsersList={onlineUsersList}/>
        <main className={"flex-1 min-w-0  h-screen overflow-y-auto w-fit"}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}