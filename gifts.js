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
    id: 'sofa', emoji: '🛋️', goal: 1200, raised: 300, link: '',
    title: { en: 'A New Sofa',            es: 'Un sofá nuevo',            fr: 'Un nouveau canapé',        de: 'Ein neues Sofa' },
    desc:  { en: 'For cosy evenings together in our first home.',
             es: 'Para noches acogedoras juntos en nuestro primer hogar.',
             fr: 'Pour des soirées douillettes dans notre premier chez-nous.',
             de: 'Für gemütliche Abende zu zweit in unserem ersten Zuhause.' },
  },
  {
    id: 'honeymoon', emoji: '🌴', goal: 3000, raised: 950, link: '',
    title: { en: 'Honeymoon Fund',        es: 'Fondo de luna de miel',    fr: 'Cagnotte lune de miel',    de: 'Flitterwochen-Fonds' },
    desc:  { en: 'Help us start married life with a trip we’ll never forget.',
             es: 'Ayúdanos a empezar la vida de casados con un viaje inolvidable.',
             fr: 'Aidez-nous à débuter notre vie de mariés par un voyage inoubliable.',
             de: 'Helft uns, das Eheleben mit einer unvergesslichen Reise zu beginnen.' },
  },
  {
    id: 'decoration', emoji: '🖼️', goal: 600, raised: 180, link: '',
    title: { en: 'Home Decoration',       es: 'Decoración del hogar',     fr: 'Décoration de la maison',  de: 'Wohnungs-Deko' },
    desc:  { en: 'Little touches to make our flat feel like ours.',
             es: 'Pequeños detalles para que nuestro piso se sienta nuestro.',
             fr: 'De petites touches pour rendre notre appartement bien à nous.',
             de: 'Kleine Details, die unsere Wohnung zu unserer machen.' },
  },
  {
    id: 'kitchen', emoji: '🍳', goal: 500, raised: 220, link: '',
    title: { en: 'Kitchen Essentials',    es: 'Utensilios de cocina',     fr: 'Ustensiles de cuisine',    de: 'Küchenausstattung' },
    desc:  { en: 'Pots, pans and tools for many home-cooked meals.',
             es: 'Ollas, sartenes y utensilios para muchas comidas caseras.',
             fr: 'Casseroles, poêles et ustensiles pour de bons petits plats.',
             de: 'Töpfe, Pfannen und Werkzeuge für viele Mahlzeiten zu Hause.' },
  },
  {
    id: 'dining', emoji: '🍽️', goal: 900, raised: 150, link: '',
    title: { en: 'Dining Table & Chairs', es: 'Mesa y sillas de comedor',  fr: 'Table et chaises',         de: 'Esstisch & Stühle' },
    desc:  { en: 'A place to gather friends and family around.',
             es: 'Un lugar para reunir a amigos y familia.',
             fr: 'Un lieu pour rassembler amis et famille.',
             de: 'Ein Platz, um Freunde und Familie zu versammeln.' },
  },
  {
    id: 'coffee', emoji: '☕', goal: 450, raised: 450, link: '',
    title: { en: 'Espresso Machine',      es: 'Cafetera espresso',        fr: 'Machine à espresso',       de: 'Espressomaschine' },
    desc:  { en: 'For slow mornings and good coffee at home.',
             es: 'Para mañanas tranquilas y buen café en casa.',
             fr: 'Pour des matins tranquilles et un bon café à la maison.',
             de: 'Für ruhige Morgen und guten Kaffee zu Hause.' },
  },
  {
    id: 'bedroom', emoji: '🛏️', goal: 800, raised: 260, link: '',
    title: { en: 'Bedroom Refresh',       es: 'Renovar el dormitorio',    fr: 'Renouveau de la chambre',  de: 'Neues Schlafzimmer' },
    desc:  { en: 'A restful room to come home to each night.',
             es: 'Una habitación de descanso a la que volver cada noche.',
             fr: 'Une chambre reposante où rentrer chaque soir.',
             de: 'Ein erholsames Zimmer für jeden Abend.' },
  },
  {
    id: 'plants', emoji: '🪴', goal: 250, raised: 90, link: '',
    title: { en: 'Plants & Greenery',     es: 'Plantas y verde',          fr: 'Plantes et verdure',       de: 'Pflanzen & Grün' },
    desc:  { en: 'A little life and green for our windowsills.',
             es: 'Un poco de vida y verde para nuestras ventanas.',
             fr: 'Un peu de vie et de verdure pour nos rebords de fenêtre.',
             de: 'Ein bisschen Leben und Grün für unsere Fensterbänke.' },
  },
  {
    id: 'linens', emoji: '🧺', goal: 350, raised: 60, link: '',
    title: { en: 'Linens & Textiles',     es: 'Ropa de hogar',            fr: 'Linge de maison',          de: 'Heimtextilien' },
    desc:  { en: 'Soft towels, sheets and everyday comforts.',
             es: 'Toallas suaves, sábanas y comodidades diarias.',
             fr: 'Serviettes douces, draps et petits conforts du quotidien.',
             de: 'Weiche Handtücher, Bettwäsche und Komfort für jeden Tag.' },
  },
  {
    id: 'dinner', emoji: '🍷', goal: 200, raised: 40, link: '',
    title: { en: 'A Special Dinner Out',  es: 'Una cena especial',        fr: 'Un dîner spécial',         de: 'Ein besonderes Dinner' },
    desc:  { en: 'Treat us to a celebratory dinner as newlyweds.',
             es: 'Invítanos a una cena de celebración como recién casados.',
             fr: 'Offrez-nous un dîner de fête en jeunes mariés.',
             de: 'Ladet uns als Frischvermählte zu einem Festessen ein.' },
  },
];

// UI strings for the registry (kept here so cards re-render on language change)
window.GIFTS_UI = {
  en: { contribute: 'Contribute', of: 'of', funded: 'funded', complete: 'Fully funded - thank you!',
        give: 'Give towards', choose: 'Choose an amount (you confirm the final amount on the next screen)',
        custom: 'Other', card: 'Contribute by card', soon: 'Card payments coming soon',
        bank: 'Prefer a bank transfer? Use the details above.', secure: 'Payments are handled securely by Stripe.' },
  es: { contribute: 'Contribuir', of: 'de', funded: 'financiado', complete: '¡Totalmente financiado - gracias!',
        give: 'Contribuir a', choose: 'Elige una cantidad (confirmarás el importe final en la siguiente pantalla)',
        custom: 'Otra', card: 'Contribuir con tarjeta', soon: 'Pagos con tarjeta próximamente',
        bank: '¿Prefieres una transferencia? Usa los datos de arriba.', secure: 'Los pagos se procesan de forma segura con Stripe.' },
  fr: { contribute: 'Contribuer', of: 'sur', funded: 'financé', complete: 'Entièrement financé - merci !',
        give: 'Contribuer à', choose: 'Choisissez un montant (vous confirmez le montant final à l’écran suivant)',
        custom: 'Autre', card: 'Contribuer par carte', soon: 'Paiement par carte bientôt disponible',
        bank: 'Vous préférez un virement ? Utilisez les coordonnées ci-dessus.', secure: 'Les paiements sont sécurisés par Stripe.' },
  de: { contribute: 'Beitragen', of: 'von', funded: 'finanziert', complete: 'Vollständig finanziert - danke!',
        give: 'Beitragen zu', choose: 'Wähle einen Betrag (den Endbetrag bestätigst du im nächsten Schritt)',
        custom: 'Andere', card: 'Mit Karte beitragen', soon: 'Kartenzahlung folgt in Kürze',
        bank: 'Lieber per Überweisung? Nutze die Daten oben.', secure: 'Zahlungen werden sicher über Stripe abgewickelt.' },
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
      card.innerHTML = `
        <div class="reg-card__emoji">${g.emoji}</div>
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
