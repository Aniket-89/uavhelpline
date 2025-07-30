"use server"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function DashboardLayout({children,}: {children: React.ReactNode}) {
    return (
        <SidebarProvider>
            <AppSidebar/>
        <main className="w-full">
            <SidebarTrigger/>

            {children}
        </main>
        </SidebarProvider>
    )
}