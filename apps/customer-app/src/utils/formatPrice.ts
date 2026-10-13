export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatPriceShort = (price: number): string => {
  return `฿${price.toLocaleString("th-TH")}`;
};

/** สร้าง UUID v4 อย่างง่ายสำหรับ cartItemId */
export const generateId = (): string => {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
};