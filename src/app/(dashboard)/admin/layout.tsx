import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "sonner"

export default async function DashboardLayout({children,}: {children: React.ReactNode}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 !h-4" />
                    <span className="text-sm text-muted-foreground font-medium">Admin</span>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
            <Toaster richColors position="bottom-right" />
        </SidebarProvider>
    )
}
