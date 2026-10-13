# BizFlow — Staff Console

Role-based back-office used by restaurant staff. Log in with a seeded account (`admin` / `kitchen` / `cashier`, password `<role>123`).

| Page | Roles | Purpose |
|---|---|---|
| Dashboard | admin | Today's revenue, order counts, active tables, top-selling dishes |
| Kitchen | admin, kitchen | Live order queue; move orders `pending → cooking → served` |
| Cashier | admin, cashier | Confirm PromptPay payments and close tables |
| Menu | admin | Create, edit and toggle availability of menu items |

```bash
cp .env.example .env
npm install
npm run dev            # http://localhost:4000
```

See the [root README](../../README.md) for the full system.
