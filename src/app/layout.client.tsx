"use client";

import Navbar from "@/components/layouts/Navbar/Navbar";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Navbar />
      <main>{children}</main>
    </SessionProvider>
  );
}
