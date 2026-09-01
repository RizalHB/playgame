import { Navbar } from "@/components/navigation/Navbar";

export function Header() {
  return (
    <header
      className="
        sticky
        top-0
        z-[90]
        border-b
        border-white/10
        bg-zinc-950/90
        shadow-lg
        shadow-black/10
        backdrop-blur-xl
        supports-[backdrop-filter]:bg-zinc-950/75
      "
    >
      <Navbar />
    </header>
  );
}
