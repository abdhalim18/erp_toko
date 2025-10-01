"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SupplierProvider } from "@/context/SupplierContext";
import { Toaster } from "@/components/ui/toaster";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;
    
    // If user is not authenticated and not on login page, redirect to login
    if (!session && pathname !== '/login') {
      router.push('/login');
    }
    // If user is authenticated and on login page, redirect to home
    else if (session && pathname === '/login') {
      router.push('/beranda');
    }
    // Redirect from old dashboard URL
    else if (pathname === '/dashboard') {
      router.replace('/beranda');
    }
  }, [session, status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <SupplierProvider>
        {children}
        <Toaster />
      </SupplierProvider>
    </ThemeProvider>
  );
}
