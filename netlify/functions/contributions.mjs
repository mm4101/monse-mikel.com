// Live contribution totals for the gift registry (honor-based).
// GET  /api/contributions -> { giftId: totalConfirmed€, ... }
// POST /api/contributions { gift, amount } -> adds a guest-confirmed
//   contribution and returns the updated totals.
//
// Storage: Netlify Blobs, store "contributions".
//   key "totals" - running total per gift, what the bars read.
//   key "log"    - one entry per confirmation, for reconciling against the
//                  Revolut statement. Not exposed over HTTP.
// Guests confirm manually after paying on revolut.me, so treat these numbers
// as pledges: verify against the actual Revolut statement now and then.

import { getStore } from '@netlify/blobs';

const GIFT_IDS = ['sofa', 'honeymoon', 'kitchen', 'renovation', 'decoration'];
const MAX_AMOUNT = 10000;

export default async (req) => {
  const store = getStore('contributions');

  if (req.method === 'GET') {
    const totals = (await store.get('totals', { type: 'json' })) || {};
    return Response.json(totals, {
      headers: { 'cache-control': 'no-store' },
    });
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response('Bad request', { status: 400 });
    }
    const gift = body && body.gift;
    const amount = Math.round(Number(body && body.amount));
    const name = String((body && body.name) || '').trim().slice(0, 80);
    // Admin corrections: authorized by the shared token, may be negative
    // (e.g. undo an unconfirmed pledge), never forwarded to the sheet.
    const isAdmin = Boolean(body && body.admin) && body.admin === process.env.SHEET_WEBHOOK_TOKEN;
    const amountOk = isAdmin
      ? Number.isFinite(amount) && Math.abs(amount) <= MAX_AMOUNT && amount !== 0
      : Number.isFinite(amount) && amount >= 1 && amount <= MAX_AMOUNT;
    if (!GIFT_IDS.includes(gift) || !amountOk || (!isAdmin && name.length < 2)) {
      return new Response('Bad request', { status: 400 });
    }

    const totals = (await store.get('totals', { type: 'json' })) || {};
    totals[gift] = Math.max(0, (totals[gift] || 0) + amount);
    await store.setJSON('totals', totals);

    if (isAdmin) {
      return Response.json(totals, { headers: { 'cache-control': 'no-store' } });
    }

    const log = (await store.get('log', { type: 'json' })) || [];
    const at = new Date().toISOString();
    log.push({ gift, amount, name, at });
    await store.setJSON('log', log);

    // Also append the row to the Google Sheet via its Apps Script web app.
    // Best-effort: a sheet hiccup must never break the guest's confirmation.
    const hook = process.env.SHEET_WEBHOOK_URL;
    if (hook) {
      try {
        await fetch(hook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            token: process.env.SHEET_WEBHOOK_TOKEN || '',
            name, gift, amount, at,
          }),
        });
      } catch { /* logged in Blobs regardless */ }
    }

    return Response.json(totals, {
      headers: { 'cache-control': 'no-store' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/contributions' };
