# TOSS TMS

Internal dispatch TMS for Trucking One Stop Shop. TOSS dispatches for several carrier
companies and bills each one a percentage of the gross ("dispatch fee"). Live at
https://tosstms.com.

## What's in it

| Area | What it does |
|---|---|
| Dashboard | Month KPIs, fleet board (which trucks need a load), today's pickups/deliveries, items needing attention, 12-week trend |
| Loads | List / Board (drag to change status) / Calendar. Filters, bulk status, CSV and printable report |
| New / edit load | Drop a rate con → broker, rate, stops, miles filled in. Multi-stop editor, Mapbox miles + deadhead, every field editable |
| Load page | Status stepper, per-stop progress, map, re-assign truck/driver, paperwork checklist (RC/BOL/POD), one-click factoring packet (merged PDF), activity log with notes |
| Invoices | "Ready to bill" per carrier, invoice from delivered loads, inline-editable invoice, Draft/Sent/Paid/Void (loads follow), overdue tracking, PDF, custom invoices |
| Analytics | Gross, fee, RPM, miles, collections; by carrier, driver, truck, broker, lane, dispatcher |
| Fleet & Company | Carriers, trucks (broker sheet with one-tap copy + pitch), drivers (CDL/medical expiry), documents (with expiry), encrypted credentials vault, profile & fee terms |
| Settings | Team, invoice profile, document types, light/dark |
| Admin panel | Super admins invite people, set role and position, disable or delete logins, activity log |
| Profile | Photo, position, phones, timezone, hours, email signature |

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the keys. Open http://localhost:3000.

**UI preview without logging in (development only):** open http://localhost:3000/preview-ui
to browse every page with sample data. `/preview-ui?off` turns it off. It cannot be enabled
in a production build.

## Database

Supabase project `yguxmgqnnbjmpzrxqlco` (TOSS TMS only). Tables are `public.tms_*`, the
admin layer `public.toss_super_admins` / `toss_admin_audit`, and the `tms_private` schema.
Migrations are in `supabase/migrations`, applied in order.

- Access: a login can use the TMS only if it has a row in `tms_members`
  (Admin panel or Settings → Team). Owners manage the team, invoice profile, and can delete companies.
- Files: private storage bucket `tms-docs`, opened through short-lived signed links.
- Vault passwords are encrypted at rest (pgcrypto, key in Supabase Vault).
- Realtime keeps every dispatcher's screen in sync.

## Rate confirmation reader

`/api/ratecon`: PDF text (or page images for scans) → DeepSeek `deepseek-flash` with a time
limit → a local rule-based reader fills anything missing (and everything when DeepSeek is
busy) → Mapbox highway miles. The dispatcher reviews and can change every field.
