import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/auth/current-admin";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#171a21] text-white">
      {children}
    </div>
  );
}