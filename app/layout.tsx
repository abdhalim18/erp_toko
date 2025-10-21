import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterClient from "@/components/ToasterClient";
import { SupplierProvider } from "@/context/SupplierContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VetMed ERP - Veterinary Medicine Store Management",
  description: "Comprehensive ERP system for veterinary medicine stores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupplierProvider>
          <ToasterClient />
          {children}
        </SupplierProvider>
      </body>
    </html>
  );
}
