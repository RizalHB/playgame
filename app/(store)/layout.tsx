import type { ReactNode } from "react";

import { MainLayout } from "@/components/layout/MainLayout";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({
  children,
}: StoreLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}