import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Header />

      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}
