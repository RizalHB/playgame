import Link from "next/link";

import {
  ShoppingCart,
  WalletCards,
} from "lucide-react";

import { AuthNav } from "@/components/auth/AuthNav";
import { MobileNav } from "@/components/navigation/MobileNav";

import { getCurrentSession } from "@/lib/auth/session";
import { getCartBadgeCount } from "@/lib/database/queries/cart-badge";

export async function Navbar() {
  const session =
    await getCurrentSession();

  const authenticated =
    Boolean(session);

  const cartCount = authenticated
    ? await getCartBadgeCount()
    : 0;

  return (
    <nav
      className="
        mx-auto
        flex
        h-[73px]
        max-w-7xl
        items-center
        justify-between
        px-4
        sm:px-6
      "
    >
      {/* Logo */}
      <Link
        href="/"
        className="
          flex
          items-center
          gap-2
          text-xl
          font-bold
          tracking-tight
          text-white
          transition
          hover:text-blue-400
        "
      >
        <span
          className="
            h-2.5
            w-2.5
            rounded-full
            bg-blue-500
            shadow-lg
            shadow-blue-500/50
          "
        />

        PlayGame
      </Link>

      {/* Desktop navigation */}
      <div className="hidden items-center gap-1 md:flex">
        {/* Store - selalu tampil */}
        <Link
          href="/"
          className="
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            text-zinc-300
            transition
            hover:bg-white/5
            hover:text-white
          "
        >
          Store
        </Link>

        {/* Authenticated navigation */}
        {authenticated && (
          <>
            <Link
              href="/library"
              className="
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                text-zinc-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              Library
            </Link>

            <Link
              href="/wallet"
              className="
                flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                text-zinc-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <WalletCards size={17} />

              Wallet
            </Link>

            <Link
              href="/downloads"
              className="
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                text-zinc-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              Downloads
            </Link>

            <Link
              href="/cart"
              className="
                relative
                ml-1
                flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                text-zinc-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <ShoppingCart size={18} />

              Cart

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-500
                    px-1.5
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}

        {/* Login / Logout */}
        <div className="ml-2">
          <AuthNav
            authenticated={authenticated}
          />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav
        authenticated={authenticated}
        cartCount={cartCount}
      />
    </nav>
  );
}
