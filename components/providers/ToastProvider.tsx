"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      expand
      duration={3000}
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-zinc-700",
        },
      }}
    />
  );
}