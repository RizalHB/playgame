import QRCode from "qrcode";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

export async function generateWalletPaymentQr(
  paymentToken: string,
) {
  if (!paymentToken) {
    throw new Error(
      "Payment token is required.",
    );
  }

  const paymentUrl =
    `${APP_URL}/wallet/payment/${encodeURIComponent(
      paymentToken,
    )}`;

  const qrDataUrl =
    await QRCode.toDataURL(paymentUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
    });

  return {
    paymentUrl,
    qrDataUrl,
  };
}