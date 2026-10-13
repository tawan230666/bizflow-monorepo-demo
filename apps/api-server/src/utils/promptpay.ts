import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export interface PromptPayResult {
  payload: string;
  qrImageUrl: string; // base64 data URL
}

export const generatePromptPayQR = async (
  promptPayId: string,
  amount: number
): Promise<PromptPayResult> => {
  const payload = generatePayload(promptPayId, { amount });
  const qrImageUrl = await QRCode.toDataURL(payload, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  return { payload, qrImageUrl };
};
