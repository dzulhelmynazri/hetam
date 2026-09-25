import DashboardSidebarHeader from "@/components/layout/sidebar/dashboard-sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { generateWebsiteMetadata } from "@/constants/meta-data";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = generateWebsiteMetadata({
  title: "hetam | Dashboard",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await serverAuth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/?login=true");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="dash-page h-full overflow-hidden">
          <DashboardSidebarHeader />
          <main className="dash-layout-page-content-height scroll-bar-hidden overflow-y-scroll">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
