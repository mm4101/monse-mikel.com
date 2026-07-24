# monse-mikel.com

Source for the wedding website **Monse & Mikel** - April 10, 2027 · Quinta San Carlos, Mexico.

Live site: https://monse-mikel.com (hosted on Netlify).

A plain static site - no build step. Pages are hand-written HTML with shared
`styles.css`, `script.js`, and `translations.js` (English/Spanish i18n).

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Home |
| `vuelos.html` | Flights |
| `informacion.html` | Information |
| `rsvp.html` | RSVP |
| `recomendaciones.html` | Recommendations |
| `lista-de-regalos.html` | Gift registry |
| `styles.css` | All styles |
| `script.js` | Nav + interactions |
| `translations.js` | i18n strings |
| `images/` | Photos and assets |

On Netlify, clean URLs (e.g. `/vuelos`) are served automatically from the
matching `.html` file.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

> Note: `styles.css` references `images/chapala-promenade.jpg`, which is not
> present in the deploy (returns 404 on the live site) - a pre-existing broken
> reference, preserved here as-is.
