import { formatPrice } from "@/utils/formatPrice";

interface Props {
  qrImageUrl?: string;
  amount: number;
}

export const PaymentQR = ({ qrImageUrl, amount }: Props) => (
  <div className="bg-white rounded-2xl p-6 text-center">
    <h3 className="font-semibold mb-1">ชำระเงินด้วย PromptPay</h3>
    <p className="text-2xl font-bold text-amber-600 mb-4">
      {formatPrice(amount)}
    </p>
    <div className="bg-stone-50 rounded-2xl p-4 inline-block">
      {qrImageUrl ? (
        <img
          src={qrImageUrl}
          alt="PromptPay QR"
          className="w-56 h-56 object-contain"
        />
      ) : (
        <div className="w-56 h-56 flex items-center justify-center text-stone-400">
          กำลังสร้าง QR...
        </div>
      )}
    </div>
    <p className="text-xs text-stone-500 mt-4">
      สแกน QR ผ่านแอปธนาคารเพื่อชำระเงิน
    </p>
  </div>
);
