// Live "who's coming" display for the home page.
// RSVPs live in Luma, so the couple maintain this list by hand (admin),
// exactly like the gift-registry and WhatsApp-interest counters.
//
// GET  /api/attendance -> { countries: [{ code, name, count }], totalCountries,
//        totalGuests, total, asOf }  sorted by count (desc), then name. Public.
//        `totalGuests` is the sum of the rows; `total` is the headline figure
//        the couple set by hand (guests can be counted once while a nationality
//        breakdown differs, e.g. dual nationals) - the home page shows `total`
//        when set, otherwise falls back to `totalGuests`. `asOf` is a display date.
// POST /api/attendance (admin token required), two shapes:
//   { admin, code, name, count }     - upsert a country by ISO alpha-2 code;
//                                       count <= 0 removes it. name kept if omitted.
//   { admin, meta: true, total, asOf } - set the headline total + as-of date.
//                                        total "" / null clears the override.
//
// Storage: Netlify Blobs, store "attendance".
//   key "countries" - array of { code, name, count }, the breakdown.
//   key "meta"      - { total, asOf } headline figure + date string (YYYY-MM-DD).

import { getStore } from '@netlify/blobs';

const MAX_COUNT = 100000;
// ISO 3166-1 alpha-2: two ASCII letters. Flags are rendered from this code.
const CODE_RE = /^[a-z]{2}$/;

function sortCountries(list) {
  return list
    .slice()
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function summary(list, meta) {
  const countries = sortCountries(list.filter((c) => c.count > 0));
  const totalGuests = countries.reduce((sum, c) => sum + c.count, 0);
  const total = meta && Number.isFinite(meta.total) ? meta.total : totalGuests;
  const asOf = (meta && meta.asOf) || null;
  return { countries, totalCountries: countries.length, totalGuests, total, asOf };
}

const ASOF_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async (req) => {
  const store = getStore({ name: 'attendance', consistency: 'strong' });

  if (req.method === 'GET') {
    const list = (await store.get('countries', { type: 'json' })) || [];
    const meta = (await store.get('meta', { type: 'json' })) || {};
    return Response.json(summary(list, meta), {
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

    // All writes are admin-only, authorized by the same shared token the
    // other counters use.
    const token = process.env.SHEET_WEBHOOK_TOKEN;
    if (!token || !body || body.admin !== token) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Headline total + as-of date (set by hand; independent of the row sum).
    if (body.meta === true) {
      const meta = (await store.get('meta', { type: 'json' })) || {};
      if (body.total === '' || body.total === null) {
        delete meta.total;
      } else {
        const total = Math.round(Number(body.total));
        if (!Number.isFinite(total) || total < 0 || total > MAX_COUNT) {
          return new Response('Bad request', { status: 400 });
        }
        meta.total = total;
      }
      if (body.asOf === '' || body.asOf === null) {
        delete meta.asOf;
      } else if (ASOF_RE.test(String(body.asOf))) {
        meta.asOf = String(body.asOf);
      } else {
        return new Response('Bad request', { status: 400 });
      }
      await store.setJSON('meta', meta);
      const list = (await store.get('countries', { type: 'json' })) || [];
      return Response.json(summary(list, meta), { headers: { 'cache-control': 'no-store' } });
    }

    const code = String(body.code || '').trim().toLowerCase();
    const name = String(body.name || '').trim().slice(0, 60);
    const count = Math.round(Number(body.count));

    if (!CODE_RE.test(code) || !Number.isFinite(count) || Math.abs(count) > MAX_COUNT) {
      return new Response('Bad request', { status: 400 });
    }

    const list = (await store.get('countries', { type: 'json' })) || [];
    const idx = list.findIndex((c) => c.code === code);

    if (count <= 0) {
      // Remove the country entirely.
      if (idx !== -1) list.splice(idx, 1);
    } else if (idx === -1) {
      // New country - a display name is required when first adding it.
      if (name.length < 2) return new Response('Name required', { status: 400 });
      list.push({ code, name, count });
    } else {
      list[idx].count = count;
      if (name.length >= 2) list[idx].name = name;
    }

    await store.setJSON('countries', list);
    const meta = (await store.get('meta', { type: 'json' })) || {};
    return Response.json(summary(list, meta), {
      headers: { 'cache-control': 'no-store' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/attendance' };
