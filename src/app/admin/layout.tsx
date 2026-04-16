import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/layout";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[var(--background)]">
        <AdminSidebar />
        <main className="pl-64">
          {children}
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
            success: {
              iconTheme: {
                primary: "var(--accent)",
                secondary: "white",
              },
            },
          }}
        />
      </div>
    </SessionProvider>
  );
}
