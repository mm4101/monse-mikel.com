// Interest counters for the proposed WhatsApp channels (home page).
// GET  /api/whatsapp-interest -> { en: n, es: n, fr: n }
// POST /api/whatsapp-interest { channel, name } -> increments and returns counts.
// Storage: Netlify Blobs, store "whatsapp-interest".
//   key "counts" - per-channel totals, what the cards read.
//   key "log"    - one entry per sign-up (channel, name, at). Not exposed over HTTP.
// Each sign-up is also appended to the "Request Whatsapp Channel" Google Sheet
// via the same Apps Script web app the gift registry uses (kind: "whatsapp").

import { getStore } from '@netlify/blobs';

const CHANNELS = ['en', 'es', 'fr'];

export default async (req) => {
  const store = getStore({ name: 'whatsapp-interest', consistency: 'strong' });

  if (req.method === 'GET') {
    const counts = (await store.get('counts', { type: 'json' })) || {};
    return Response.json(counts, { headers: { 'cache-control': 'no-store' } });
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response('Bad request', { status: 400 });
    }
    const channel = body && body.channel;
    const name = String((body && body.name) || '').trim().slice(0, 80);
    // Admin corrections, authorized by the shared token (may be negative)
    const isAdmin = Boolean(body && body.admin) && body.admin === process.env.SHEET_WEBHOOK_TOKEN;
    const delta = isAdmin ? Math.round(Number(body.delta ?? 1)) : 1;
    if (!CHANNELS.includes(channel) || !Number.isFinite(delta) || (!isAdmin && name.length < 2)) {
      return new Response('Bad request', { status: 400 });
    }
    const counts = (await store.get('counts', { type: 'json' })) || {};
    counts[channel] = Math.max(0, (counts[channel] || 0) + delta);
    await store.setJSON('counts', counts);

    if (isAdmin) {
      return Response.json(counts, { headers: { 'cache-control': 'no-store' } });
    }

    const log = (await store.get('log', { type: 'json' })) || [];
    const at = new Date().toISOString();
    log.push({ channel, name, at });
    await store.setJSON('log', log);

    // Also append the row to the Google Sheet via its Apps Script web app.
    // Best-effort: a sheet hiccup must never break the guest's sign-up.
    const hook = process.env.SHEET_WEBHOOK_URL;
    if (hook) {
      try {
        await fetch(hook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            token: process.env.SHEET_WEBHOOK_TOKEN || '',
            kind: 'whatsapp',
            channel, name, at,
          }),
        });
      } catch { /* logged in Blobs regardless */ }
    }

    return Response.json(counts, { headers: { 'cache-control': 'no-store' } });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/whatsapp-interest' };
