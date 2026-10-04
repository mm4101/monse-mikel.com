// ============================================================
//  Guests by country - a live, celebratory "who's coming" strip
//  on the home page. RSVPs live in Luma, so Monse & Mikel keep
//  this list up to date by hand. The numbers below are the baked-in
//  defaults that always show; if /admin has been used to set live
//  figures in Netlify Blobs, those override the defaults.
//  Flags: flagcdn.com, keyed by ISO 3166-1 alpha-2 country code.
//  To update: edit DEFAULTS below (or use /admin for a no-deploy change).
// ============================================================
(function () {
  const section = document.getElementById('countries');
  const grid = document.getElementById('countriesGrid');
  const countEl = document.getElementById('countriesCount');
  const asofEl = document.getElementById('countriesAsof');
  if (!section || !grid) return;

  const API = '/api/attendance';
  const LANGS = ['en', 'es', 'fr', 'de'];
  const LOCALE = { en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' };

  // Localized big count, e.g. "101 guests confirmed".
  const CONFIRMED = {
    en: (g) => `${g} guest${g === 1 ? '' : 's'} confirmed`,
    es: (g) => `${g} invitado${g === 1 ? '' : 's'} confirmado${g === 1 ? '' : 's'}`,
    fr: (g) => `${g} invité${g === 1 ? '' : 's'} confirmé${g === 1 ? '' : 's'}`,
    de: (g) => `${g} ${g === 1 ? 'Gast' : 'Gäste'} bestätigt`,
  };
  // Localized "N countries".
  const COUNTRIES = {
    en: (c) => `${c} countr${c === 1 ? 'y' : 'ies'}`,
    es: (c) => `${c} paí${c === 1 ? 's' : 'ses'}`,
    fr: (c) => `${c} pays`,
    de: (c) => `${c} ${c === 1 ? 'Land' : 'Länder'}`,
  };
  // Localized "as of <date>" prefix.
  const ASOF = { en: 'As of', es: 'Actualizado el', fr: 'Au', de: 'Stand' };

  function currentLang() {
    const l = localStorage.getItem('wedding_lang') || (navigator.language || 'en').slice(0, 2);
    return LANGS.includes(l) ? l : 'en';
  }

  // "2026-10-04" -> localized "4 October 2026" (built from parts to dodge TZ shifts).
  function fmtDate(iso, lang) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    try {
      return d.toLocaleDateString(LOCALE[lang] || 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return iso;
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (m) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
    ));
  }

  // Baked-in defaults - shown straight from the deployed code, no setup needed.
  // headline total is set by hand (guests counted once; 4 dual-nationals are
  // counted in both their countries, so the rows sum to 113 while total = 109).
  const DEFAULTS = {
    total: 109,
    asOf: '2026-10-04',
    countries: [
      { code: 'mx', name: 'Mexico', count: 75 },
      { code: 'fr', name: 'France', count: 14 },
      { code: 'us', name: 'United States', count: 6 },
      { code: 'de', name: 'Germany', count: 5 },
      { code: 'tw', name: 'Taiwan', count: 3 },
      { code: 'hu', name: 'Hungary', count: 2 },
      { code: 'in', name: 'India', count: 2 },
      { code: 'pl', name: 'Poland', count: 4 },
      { code: 'it', name: 'Italy', count: 1 },
      { code: 'ma', name: 'Morocco', count: 1 },
    ],
  };

  // Normalize a {countries, total, asOf} set the way the render expects.
  function norm(src) {
    const countries = (src.countries || [])
      .filter((c) => c.count > 0)
      .slice()
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const totalGuests = countries.reduce((s, c) => s + c.count, 0);
    return {
      countries,
      totalCountries: countries.length,
      totalGuests,
      total: Number.isFinite(src.total) ? src.total : totalGuests,
      asOf: src.asOf || null,
    };
  }

  let DATA = norm(DEFAULTS);

  function render() {
    if (!DATA || !Array.isArray(DATA.countries) || DATA.countries.length === 0) {
      section.hidden = true;
      return;
    }
    section.hidden = false;

    const lang = currentLang();
    // `total` is the couple's headline figure; fall back to the row sum.
    const total = Number.isFinite(DATA.total) ? DATA.total : DATA.totalGuests;
    if (countEl) countEl.textContent = (CONFIRMED[lang] || CONFIRMED.en)(total);
    if (asofEl) {
      const parts = [(COUNTRIES[lang] || COUNTRIES.en)(DATA.totalCountries)];
      const date = fmtDate(DATA.asOf, lang);
      if (date) parts.push(`${ASOF[lang] || ASOF.en} ${date}`);
      asofEl.textContent = parts.join(' · ');
    }

    grid.innerHTML = '';
    DATA.countries.forEach((c) => {
      const chip = document.createElement('div');
      chip.className = 'country';
      // flagcdn serves crisp SVGs; if a code is wrong the flag just hides.
      chip.innerHTML = `
        <span class="country__flag">
          <img src="https://flagcdn.com/${encodeURIComponent(c.code)}.svg"
               alt="${esc(c.name)}" loading="lazy" width="54" height="36"
               onerror="this.style.visibility='hidden'" />
        </span>
        <span class="country__name">${esc(c.name)}</span>
        <span class="country__count">${Number(c.count) || 0}</span>`;
      grid.appendChild(chip);
    });
  }

  // Show the defaults right away, then let live /admin data override if present.
  render();
  fetch(API)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d && Array.isArray(d.countries) && d.countries.length) { DATA = d; render(); }
    })
    .catch(() => { /* keep the baked-in defaults */ });

  // The language switcher rewrites the headline wording live.
  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.addEventListener('click', () => { if (DATA) render(); });
  });
})();
