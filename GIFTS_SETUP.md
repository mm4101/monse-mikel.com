# Gift Registry - how it works & how to finish it

The Gifts page (`/lista-de-regalos`) has an itemised registry: ~10 gifts, each
with a **funding progress bar** and a **Contribute** button that opens a small
modal. It's built to run on the current **static site** (no server, no database)
and to stay GitHub-as-source.

All the gift data lives in one file: **`gifts.js`**.

---

## 1. Editing gifts (no coding)

Open `gifts.js` and edit the `GIFTS` array. Each gift looks like:

```js
{
  id: 'sofa', emoji: '🛋️', goal: 1200, raised: 300, link: '',
  title: { en: 'A New Sofa', es: 'Un sofá nuevo', fr: '…', de: '…' },
  desc:  { en: 'For cosy evenings…', es: '…', fr: '…', de: '…' },
},
```

- **`goal`** - target amount in € for that gift.
- **`raised`** - how much has come in so far. The bar fills to `raised / goal`.
  When `raised ≥ goal`, the card shows "Fully funded" and the button disables.
- **`emoji`** - the icon at the top of the card.
- **`title` / `desc`** - shown in the visitor's language (en/es/fr/de).
- **`link`** - the Stripe Payment Link for this gift (see below). Empty = the
  button shows "Card payments coming soon".

Add or remove items by adding/removing objects in the array. Order on the page
matches array order.

> **Progress is updated manually.** Because there's no backend, `raised` is a
> number you edit yourself as gifts come in (then commit + push). If you want the
> bars to update **automatically** from real payments, see section 3.

---

## 2. Accepting card payments - Stripe Payment Links (recommended, no backend)

This is the simplest way to take money on a static site. One link per gift:

1. Create a free **Stripe account** (https://stripe.com) and complete activation
   (business/personal details + a bank account for payouts).
2. In the Stripe Dashboard → **Payment Links** → **＋ New**.
3. Product = the gift (e.g. "A New Sofa – Wedding gift"). For a gift fund, set the
   price to **"Customer chooses what to pay"** so guests can give any amount.
4. Create the link, copy its URL (looks like `https://buy.stripe.com/xxxxxxxx`).
5. Paste it into that gift's `link:` field in `gifts.js`.
6. Repeat per gift. Commit + push.

Once `link` is set, the modal's button becomes **"Contribute by card"** and opens
that Stripe page in a new tab. Stripe handles the payment; money lands in your
bank on Stripe's normal payout schedule.

**Notes**
- The suggested amount chips (€25/€50/€100/€250) are a UX hint. With a
  "customer chooses" link the guest confirms the final amount on Stripe's page.
  (If you'd rather have fixed amounts, create separate links per amount - ask me
  and I'll wire the chips to open the matching link.)
- No API keys or secrets live in this repo - Payment Links are just URLs, so
  the private repo staying private is fine either way.

---

## 3. Optional upgrade - progress bars that update themselves

If you want a bar to move on its own the moment someone pays, you need a tiny
backend to remember totals. Cleanest fit for this site (still deploys on
Netlify):

- **Stripe Checkout** (instead of Payment Links) triggered by a
  **Netlify Function**.
- A **Stripe webhook** → another Netlify Function that adds the paid amount to a
  running total per gift, stored in **Netlify Blobs** (or Supabase/Upstash).
- The page fetches those totals on load and fills each bar from live data.

This needs: Stripe secret key + webhook secret set as Netlify environment
variables, and connecting this GitHub repo to Netlify for deploys. It's a
bounded piece of work - tell me if you want it and I'll build it.

---

## Files involved

| File | Role |
| --- | --- |
| `gifts.js` | Gift data + card rendering + contribute modal (edit this) |
| `lista-de-regalos.html` | Has the `#registryGrid` mount point + section text |
| `styles.css` | `.registry`, `.reg-card`, `.reg-bar`, `.reg-modal` styles |
| `translations.js` | Section heading/lead labels (`reg_*`) in 4 languages |
