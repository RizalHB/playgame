"use client";

import { useEffect } from "react";

interface WalletPaymentExpiryRefreshProps {
  expiresAt: number | null;
}

export function WalletPaymentExpiryRefresh({
  expiresAt,
}: WalletPaymentExpiryRefreshProps) {
  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const remaining =
      expiresAt - Date.now();

    if (remaining <= 0) {
      window.location.reload();
      return;
    }

    const timer = window.setTimeout(() => {
      window.location.reload();
    }, remaining);

    return () => {
      window.clearTimeout(timer);
    };
  }, [expiresAt]);

  return null;
}