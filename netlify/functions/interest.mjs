// Interest counters for the proposed WhatsApp channels (home page).
// GET  /api/whatsapp-interest -> { en: n, es: n, fr: n }
// POST /api/whatsapp-interest { channel } -> increments and returns counts.
// Storage: Netlify Blobs, store "whatsapp-interest", key "counts".

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
    // Admin corrections, authorized by the shared token (may be negative)
    const isAdmin = Boolean(body && body.admin) && body.admin === process.env.SHEET_WEBHOOK_TOKEN;
    const delta = isAdmin ? Math.round(Number(body.delta ?? 1)) : 1;
    if (!CHANNELS.includes(channel) || !Number.isFinite(delta)) {
      return new Response('Bad request', { status: 400 });
    }
    const counts = (await store.get('counts', { type: 'json' })) || {};
    counts[channel] = Math.max(0, (counts[channel] || 0) + delta);
    await store.setJSON('counts', counts);
    return Response.json(counts, { headers: { 'cache-control': 'no-store' } });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/whatsapp-interest' };
