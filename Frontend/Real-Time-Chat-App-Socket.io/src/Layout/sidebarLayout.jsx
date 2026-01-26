import AppSidebar from "@/components/appSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function SidebarLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}