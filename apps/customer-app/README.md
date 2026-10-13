# BizFlow — Customer App

Mobile-first ordering app that diners open by scanning the QR code on their table.

**Flow:** `/table/:tableId` → menu with categories & search → item options (radio / checkbox groups) → cart → place order → live order timeline → PromptPay QR payment.

- State: Zustand (cart is persisted per table in `localStorage`)
- Live updates: joins the Socket.IO room `order:{id}` to receive status changes
- `/admin/qr-codes` prints a QR code for every table

```bash
cp .env.example .env   # VITE_API_URL, VITE_SOCKET_URL
npm install
npm run dev            # http://localhost:3003
```

See the [root README](../../README.md) for the full system.
