# REFORA — E-Commerce Website

A polished, full-stack e-commerce store built with **Next.js 15**, **Drizzle ORM + Neon PostgreSQL**, **Razorpay** payments, and **Cloudinary** media.

---

## Quick Start

```bash
cd refora-web
cp .env.example .env.local
# Fill in your credentials in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + custom CSS tokens |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Payments | Razorpay (UPI, cards, COD) |
| Media | Cloudinary (`dautrievu`) |
| Auth | NextAuth v5 |
| State | Zustand (cart) |
| Email | Resend |
| Shipping | Shiprocket adapter |
| Deployment | Vercel |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description | Status |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ Set |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | ⚠️ Awaiting client |
| `RAZORPAY_KEY_ID` | Razorpay key ID | ⚠️ Awaiting client |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | ⚠️ Awaiting client |
| `SHIPROCKET_EMAIL` | Shiprocket account email | ⚠️ Awaiting client |
| `RESEND_API_KEY` | Resend email API key | ⚠️ Awaiting client |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 ID | ⚠️ Awaiting client |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | ⚠️ Awaiting client |

---

## Database

```bash
# Generate migration from schema changes
npm run db:generate

# Apply to Neon (requires DATABASE_URL)
node migrate.js

# Drizzle Studio (visual DB browser)
npm run db:studio
```

Schema: `src/db/schema.ts` — 25 tables including products, orders, payments, shipping, discounts, reviews, content.

---

## Deploy to Vercel

### Step 1 — Login
```bash
vercel login
```

### Step 2 — Set environment variables
```bash
vercel env add DATABASE_URL production
# (paste the Neon connection string when prompted)

vercel env add AUTH_SECRET production
vercel env add CLOUDINARY_API_SECRET production
vercel env add RAZORPAY_KEY_ID production
vercel env add RAZORPAY_KEY_SECRET production
vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID production
vercel env add RESEND_API_KEY production
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER production
```

### Step 3 — Link project to GitHub repo
```bash
vercel link --repo aphidsgroup/reforaweb
```

### Step 4 — Deploy
```bash
vercel --prod
```

---

## Project Structure

```
src/
├── app/
│   ├── (store)/          # All customer-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── products/[slug]/ # Product detail
│   │   ├── shop/          # Shop listing
│   │   ├── skincare/      # Skincare collection
│   │   ├── organic/       # REFORA ORGANIC preview
│   │   ├── about/         # Our Story
│   │   ├── contact/       # Contact
│   │   ├── faqs/          # FAQ
│   │   ├── cart/          # Cart page
│   │   ├── checkout/      # Checkout flow
│   │   ├── orders/[token]/ # Order confirmation
│   │   ├── policies/[slug]/ # Legal pages
│   │   └── journal/       # Journal/blog
│   └── api/
│       ├── newsletter/subscribe/
│       ├── contact/
│       ├── shipping/check-pincode/
│       └── payments/create-order/ + webhook/
├── components/
│   ├── cart/             # Cart drawer
│   ├── home/             # Homepage sections
│   └── layout/           # Header, footer
├── db/
│   ├── schema.ts         # All 25 Drizzle tables
│   ├── index.ts          # Neon client
│   └── migrations/       # SQL migration files
├── lib/
│   └── utils.ts          # formatPrice, generateOrderNumber, etc.
└── store/
    └── cart.ts           # Zustand cart store
```

---

## Awaiting Client Input

Before going live, collect:

- [ ] Confirmed selling price and MRP for COCOCRÈME
- [ ] Full approved INCI ingredient list
- [ ] "How to use" copy
- [ ] Brand story / Our Story copy
- [ ] Hero photography (product, lifestyle)
- [ ] SVG logo file
- [ ] Razorpay Key ID + Secret (live)
- [ ] Shiprocket email + password
- [ ] WhatsApp Business number
- [ ] GA4 Measurement ID
- [ ] Meta Pixel ID
- [ ] Business GST number + registered address
- [ ] Domain DNS access (refora.in)
- [ ] Approved legal page content (privacy, terms, shipping, returns, cancellation)

---

## Brand

**Colours:** Warm Ivory `#F7F2E9` · Soft Cream `#EFE5D5` · Deep Espresso `#29231F` · Champagne Gold `#C7A56A`  
**Fonts:** Cormorant Garamond (headings) · DM Sans (body)  
**Language:** "Add to Bag" · "Your Bag" (not "cart")  
**Signature:** _Restore · Renew · Refora._
