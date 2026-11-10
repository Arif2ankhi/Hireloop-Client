import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar";
import {  Toaster } from "@/components/ui/toast";
// import { AppSidebar } from "@/components/app-sidebar"
// import DashboardSidebar from "../components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
    <SidebarProvider>
      <DashboardSidebar />
      {/* flex-1 + min-w-0: fill the width left over by the sidebar instead of
          shrinking to content (which left a white gap on wide screens). */}
      <main className="flex min-w-0 flex-1 flex-col">
        <SidebarTrigger />
        {children}
      </main>
      <Toaster/>
    </SidebarProvider>
  )
};

export default DashboardLayout;