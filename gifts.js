// ============================================================
//  Gift Registry - itemised gifts with funding progress bars
// ------------------------------------------------------------
//  HOW TO EDIT (no coding needed):
//   • Change an item's `goal` (target €) or `raised` (received so far €).
//     The progress bar and % fill update automatically.
//   • `link`  = the item's Stripe Payment Link URL (create one per gift in
//     the Stripe dashboard → Payment Links). Leave "" until you have it -
//     the button then shows "Card payments coming soon".
//   • Add / remove items freely. Emoji, titles and descriptions are per-language.
//  See GIFTS_SETUP.md for the full Stripe + optional live-backend guide.
// ============================================================

window.GIFTS = [
  {
    id: 'sofa', emoji: '🛋️', img: 'images/sofa.jpg', goal: 1200, raised: 300, link: '',
    title: { en: 'A New Sofa',            es: 'Un sofá nuevo',            fr: 'Un nouveau canapé',        de: 'Ein neues Sofa' },
    desc:  { en: 'So we can welcome you with more class.',
             es: 'Para recibiros con más estilo.',
             fr: 'Pour vous accueillir avec plus de classe.',
             de: 'Damit wir euch mit mehr Stil empfangen können.' },
  },
  {
    id: 'honeymoon', emoji: '🌴', img: 'images/honeymoon.jpg', goal: 3000, raised: 950, link: '',
    title: { en: 'Honeymoon Fund',        es: 'Fondo de luna de miel',    fr: 'Cagnotte lune de miel',    de: 'Flitterwochen-Fonds' },
    desc:  { en: 'Destination: China!',
             es: '¡Destino: China!',
             fr: 'Destination : Chine !',
             de: 'Reiseziel: China!' },
  },
  {
    id: 'kitchen', emoji: '🍳', img: 'images/kitchen.jpg', goal: 500, raised: 220, link: '',
    title: { en: 'Kitchen Essentials',    es: 'Utensilios de cocina',     fr: 'Ustensiles de cuisine',    de: 'Küchenausstattung' },
    desc:  { en: 'A new dinner set and kitchen equipment for many home-cooked meals. We love the handmade stoneware from <a href="https://onomao.com" target="_blank" rel="noopener">onomao.com</a>.',
             es: 'Una nueva vajilla y equipamiento de cocina para muchas comidas caseras. Nos encanta la cerámica artesanal de <a href="https://onomao.com" target="_blank" rel="noopener">onomao.com</a>.',
             fr: 'Un nouveau service de table et du matériel de cuisine pour de bons petits plats. Nous adorons la céramique artisanale signée <a href="https://onomao.com" target="_blank" rel="noopener">onomao.com</a>.',
             de: 'Ein neues Geschirr-Set und Küchenausstattung für viele Mahlzeiten zu Hause. Wir lieben das handgemachte Steingut von <a href="https://onomao.com" target="_blank" rel="noopener">onomao.com</a>.' },
  },
  {
    id: 'decoration', emoji: '🖼️', img: 'images/canvas.jpg', imgPos: '34%', goal: 600, raised: 180, link: '',
    title: { en: 'One Wedding Canvas',     es: 'Un lienzo de nuestra boda', fr: 'Une toile de notre mariage', de: 'Eine Hochzeits-Leinwand' },
    desc:  { en: 'A canvas to remember our wedding day.',
             es: 'Un lienzo para recordar el día de nuestra boda.',
             fr: 'Une toile pour garder le souvenir de notre mariage.',
             de: 'Eine Leinwand, die an unseren Hochzeitstag erinnert.' },
  },
];

// UI strings for the registry (kept here so cards re-render on language change)
window.GIFTS_UI = {
  en: { contribute: 'Contribute', of: 'of', funded: 'funded', complete: 'Fully funded - thank you!',
        give: 'Give towards', choose: 'Choose an amount (you confirm the final amount on the next screen)',
        custom: 'Other', card: 'Contribute by card', soon: 'Card payments coming soon',
        bank: 'Prefer a bank transfer? Use the details below.', secure: 'Payments are handled securely by Stripe.' },
  es: { contribute: 'Contribuir', of: 'de', funded: 'financiado', complete: '¡Totalmente financiado - gracias!',
        give: 'Contribuir a', choose: 'Elige una cantidad (confirmarás el importe final en la siguiente pantalla)',
        custom: 'Otra', card: 'Contribuir con tarjeta', soon: 'Pagos con tarjeta próximamente',
        bank: '¿Prefieres una transferencia? Usa los datos de abajo.', secure: 'Los pagos se procesan de forma segura con Stripe.' },
  fr: { contribute: 'Contribuer', of: 'sur', funded: 'financé', complete: 'Entièrement financé - merci !',
        give: 'Contribuer à', choose: 'Choisissez un montant (vous confirmez le montant final à l’écran suivant)',
        custom: 'Autre', card: 'Contribuer par carte', soon: 'Paiement par carte bientôt disponible',
        bank: 'Vous préférez un virement ? Utilisez les coordonnées ci-dessous.', secure: 'Les paiements sont sécurisés par Stripe.' },
  de: { contribute: 'Beitragen', of: 'von', funded: 'finanziert', complete: 'Vollständig finanziert - danke!',
        give: 'Beitragen zu', choose: 'Wähle einen Betrag (den Endbetrag bestätigst du im nächsten Schritt)',
        custom: 'Andere', card: 'Mit Karte beitragen', soon: 'Kartenzahlung folgt in Kürze',
        bank: 'Lieber per Überweisung? Nutze die Daten unten.', secure: 'Zahlungen werden sicher über Stripe abgewickelt.' },
};

(function () {
  const grid = document.getElementById('registryGrid');
  if (!grid || !window.GIFTS) return;

  const LANGS = ['en', 'es', 'fr', 'de'];
  const SUGGESTED = [25, 50, 100, 250];
  const euro = n => '€' + Number(n).toLocaleString('en-US');

  function currentLang() {
    const l = localStorage.getItem('wedding_lang') || (navigator.language || 'en').slice(0, 2);
    return LANGS.includes(l) ? l : 'en';
  }

  function render() {
    const lang = currentLang();
    const t = window.GIFTS_UI[lang];
    grid.innerHTML = '';
    window.GIFTS.forEach(g => {
      const pct = Math.min(100, Math.round((g.raised / g.goal) * 100));
      const done = g.raised >= g.goal;
      const card = document.createElement('article');
      card.className = 'reg-card' + (done ? ' reg-card--done' : '');
      const media = g.img
        ? `<div class="reg-card__photo"><img src="${g.img}" alt="${g.title[lang]}" loading="lazy"${g.imgPos ? ` style="object-position:center ${g.imgPos}"` : ''}></div>`
        : `<div class="reg-card__emoji">${g.emoji}</div>`;
      card.innerHTML = `
        ${media}
        <h3 class="reg-card__title">${g.title[lang]}</h3>
        <p class="reg-card__desc">${g.desc[lang]}</p>
        <div class="reg-card__meta">
          <span class="reg-card__raised">${euro(g.raised)}</span>
          <span class="reg-card__goal">${t.of} ${euro(g.goal)}</span>
        </div>
        <div class="reg-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="reg-bar__fill" style="width:${pct}%"></div>
        </div>
        <div class="reg-card__pct">${done ? t.complete : pct + '% ' + t.funded}</div>
        <button class="btn btn--rosa reg-card__cta"${done ? ' disabled' : ''}>${t.contribute}</button>`;
      if (!done) card.querySelector('.reg-card__cta').addEventListener('click', () => openModal(g, lang));
      grid.appendChild(card);
    });
  }

  // ---- Contribute modal ----
  const modal = document.createElement('div');
  modal.className = 'reg-modal';
  modal.innerHTML = `
    <div class="reg-modal__overlay" data-close></div>
    <div class="reg-modal__box" role="dialog" aria-modal="true">
      <button class="reg-modal__close" data-close aria-label="Close">×</button>
      <div class="reg-modal__emoji"></div>
      <h3 class="reg-modal__title"></h3>
      <p class="reg-modal__desc"></p>
      <div class="reg-amounts"></div>
      <a class="btn btn--rosa reg-modal__pay" target="_blank" rel="noopener"></a>
      <p class="reg-modal__note"></p>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function openModal(g, lang) {
    const t = window.GIFTS_UI[lang];
    modal.querySelector('.reg-modal__emoji').textContent = g.emoji;
    modal.querySelector('.reg-modal__title').textContent = t.give + ' ' + g.title[lang];
    modal.querySelector('.reg-modal__desc').textContent = t.choose;
    const amounts = modal.querySelector('.reg-amounts');
    amounts.innerHTML = '';
    SUGGESTED.forEach((a, i) => {
      const b = document.createElement('button');
      b.className = 'reg-amount' + (i === 1 ? ' active' : '');
      b.textContent = euro(a);
      b.addEventListener('click', () => {
        amounts.querySelectorAll('.reg-amount').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
      amounts.appendChild(b);
    });
    const pay = modal.querySelector('.reg-modal__pay');
    const note = modal.querySelector('.reg-modal__note');
    if (g.link) {
      pay.textContent = t.card;
      pay.href = g.link;
      pay.classList.remove('is-disabled');
      pay.removeAttribute('aria-disabled');
      note.textContent = t.secure + ' ' + t.bank;
    } else {
      pay.textContent = t.soon;
      pay.removeAttribute('href');
      pay.classList.add('is-disabled');
      pay.setAttribute('aria-disabled', 'true');
      note.textContent = t.bank;
    }
    modal.classList.add('open');
  }
  function closeModal() { modal.classList.remove('open'); }

  render();
  // Re-render cards when the visitor switches language
  document.querySelectorAll('[data-lang]').forEach(btn =>
    btn.addEventListener('click', () => setTimeout(render, 0)));
})();
