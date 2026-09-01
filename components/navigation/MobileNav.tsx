"use client";

import Link from "next/link";

import {
  Menu,
  X,
  WalletCards,
  ShoppingCart,
  LogIn,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

interface MobileNavProps {
  authenticated: boolean;
  cartCount: number;
}

const links = [
  {
    href: "/",
    label: "Store",
  },
  {
    href: "/library",
    label: "Library",
  },
  {
    href: "/downloads",
    label: "Downloads",
  },
];

export function MobileNav({
  authenticated,
  cartCount,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  /*
   * Lock page scrolling while the menu
   * is open.
   */
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /*
   * Escape closes the menu.
   */
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /*
   * Close menu when screen becomes desktop.
   */
  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(min-width: 768px)",
      );

    const handleChange = () => {
      if (mediaQuery.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleChange,
    );

    return () =>
      mediaQuery.removeEventListener(
        "change",
        handleChange,
      );
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger */}
      <button
        type="button"
        aria-label={
          open ? "Close menu" : "Open menu"
        }
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="
          relative
          z-[110]
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-white/10
          bg-white/[0.03]
          text-zinc-200
          outline-none
          transition
          duration-200
          hover:border-blue-400/30
          hover:bg-blue-500/10
          hover:text-white
          active:scale-95
          focus-visible:ring-2
          focus-visible:ring-blue-400
        "
      >
        {open ? (
          <X size={21} />
        ) : (
          <Menu size={21} />
        )}
      </button>

      {/* Menu */}
      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMenu}
            className="
              fixed
              inset-0
              z-[90]
              cursor-default
              bg-black/60
              backdrop-blur-sm
            "
          />

          {/* Panel */}
          <div
            id="mobile-menu"
            className="
              fixed
              inset-x-0
              top-[73px]
              z-[100]
              border-b
              border-blue-500/20
              bg-[#080e17]/98
              shadow-2xl
              shadow-black/50
              backdrop-blur-xl
            "
          >
            <nav className="mx-auto max-w-7xl p-4">
              <div className="space-y-1">

                {/* Store selalu tampil */}
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="
                    flex
                    min-h-12
                    items-center
                    rounded-xl
                    px-4
                    text-base
                    font-medium
                    text-zinc-300
                    transition
                    hover:bg-blue-500/10
                    hover:text-white
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-blue-400
                  "
                >
                  Store
                </Link>

                {/* Menu authenticated only */}
                {authenticated && (
                  <>
                    {links
                      .filter(
                        (link) =>
                          link.href !== "/",
                      )
                      .map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenu}
                          className="
                            flex
                            min-h-12
                            items-center
                            rounded-xl
                            px-4
                            text-base
                            font-medium
                            text-zinc-300
                            transition
                            hover:bg-blue-500/10
                            hover:text-white
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-blue-400
                          "
                        >
                          {link.label}
                        </Link>
                      ))}

                    {/* Wallet */}
                    <Link
                      href="/wallet"
                      onClick={closeMenu}
                      className="
                        flex
                        min-h-12
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        text-base
                        font-medium
                        text-zinc-300
                        transition
                        hover:bg-blue-500/10
                        hover:text-white
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-blue-400
                      "
                    >
                      <WalletCards size={20} />
                      Wallet
                    </Link>

                    {/* Cart */}
                    <Link
                      href="/cart"
                      onClick={closeMenu}
                      className="
                        flex
                        min-h-12
                        items-center
                        justify-between
                        rounded-xl
                        px-4
                        text-base
                        font-medium
                        text-zinc-300
                        transition
                        hover:bg-blue-500/10
                        hover:text-white
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-blue-400
                      "
                    >
                      <span className="flex items-center gap-3">
                        <ShoppingCart size={20} />
                        Cart
                      </span>

                      {cartCount > 0 && (
                        <span
                          className="
                            flex
                            h-6
                            min-w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-500
                            px-2
                            text-xs
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

                {/* Login hanya untuk user belum login */}
                {!authenticated && (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="
                      mt-2
                      flex
                      min-h-12
                      items-center
                      gap-3
                      rounded-xl
                      bg-blue-500
                      px-4
                      text-base
                      font-semibold
                      text-white
                      transition
                      hover:bg-blue-400
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-blue-400
                    "
                  >
                    <LogIn size={20} />
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
