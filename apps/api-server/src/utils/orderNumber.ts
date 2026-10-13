/**
 * สร้าง order number รูปแบบ ORD-YYYYMMDD-XXXX
 */
export const generateOrderNumber = (): string => {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `ORD-${dateStr}-${random}`;
};
