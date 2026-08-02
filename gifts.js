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

// ---- Payment settings --------------------------------------------------
// Revolut.Me page: guests pay by card / Apple Pay / Google Pay directly into
// your Revolut account - they don't need Revolut themselves.
// Find your link in the Revolut app: Profile → your @handle → Revolut.Me.
// A per-gift Stripe `link` (below) still takes priority if you ever add one.
window.PAY = {
  revolutMe: 'https://revolut.me/mikelmangold',
  qr: 'images/revolut-qr.png',                // QR code encoding the same link
};

window.GIFTS = [
  {
    id: 'sofa', emoji: '🛋️', img: 'images/sofa.jpg', goal: 1200, raised: 0, link: '',
    title: { en: 'A New Sofa',            es: 'Un sofá nuevo',            fr: 'Un nouveau canapé',        de: 'Ein neues Sofa' },
    desc:  { en: 'So we can welcome you with more class.',
             es: 'Para recibiros con más estilo.',
             fr: 'Pour vous accueillir avec plus de classe.',
             de: 'Damit wir euch mit mehr Stil empfangen können.' },
  },
  {
    id: 'lamp', emoji: '💡', img: 'images/living-room-lamp.jpg', imgFit: 'contain', imgBg: '#b3a294', goal: 300, raised: 0, link: '',
    title: { en: 'A Living Room Lamp',    es: 'Una lámpara para el salón', fr: 'Une lampe pour le salon',  de: 'Eine Wohnzimmerlampe' },
    desc:  { en: 'Warm light for cosy evenings in our new living room.',
             es: 'Luz cálida para tardes acogedoras en nuestro nuevo salón.',
             fr: 'Une lumière chaleureuse pour des soirées cosy dans notre nouveau salon.',
             de: 'Warmes Licht für gemütliche Abende in unserem neuen Wohnzimmer.' },
  },
  {
    id: 'honeymoon', emoji: '🌴', img: 'images/honeymoon.jpg', goal: 3000, raised: 0, link: '',
    title: { en: 'Honeymoon Fund',        es: 'Fondo de luna de miel',    fr: 'Cagnotte lune de miel',    de: 'Flitterwochen-Fonds' },
    desc:  { en: 'Destination: China!',
             es: '¡Destino: China!',
             fr: 'Destination : Chine !',
             de: 'Reiseziel: China!' },
  },
  {
    id: 'renovation', emoji: '🛠️', img: 'images/flat-renovation.jpg', imgPos: '18%', goal: 2000, raised: 0, link: '',
    title: { en: 'Flat Renovation',       es: 'Renovación del piso',      fr: 'Rénovation de l’appartement', de: 'Wohnungsrenovierung' },
    desc:  { en: 'We\'re renovating our flat to turn it into our first real home together - every contribution helps with paint, floors and repairs.',
             es: 'Estamos renovando nuestro piso para convertirlo en nuestro primer hogar juntos: cada aportación ayuda con pintura, suelos y reparaciones.',
             fr: 'Nous rénovons notre appartement pour en faire notre premier vrai chez-nous : chaque contribution aide pour la peinture, les sols et les réparations.',
             de: 'Wir renovieren unsere Wohnung, um sie in unser erstes gemeinsames Zuhause zu verwandeln - jeder Beitrag hilft bei Farbe, Böden und Reparaturen.' },
  },
  {
    id: 'kitchen', emoji: '🍳', img: 'images/kitchen.jpg', goal: 500, raised: 0, link: '',
    title: { en: 'Kitchen Essentials',    es: 'Utensilios de cocina',     fr: 'Ustensiles de cuisine',    de: 'Küchenausstattung' },
    desc:  { en: 'A new dinner set and kitchen equipment for many home-cooked meals. We love the handmade stoneware from <a href="https://onomao.com" target="_blank" rel="noopener">onomao.com</a>.',
             es: 'Una nueva vajilla y equipamiento de cocina para muchas comidas caseras. Nos encanta la cerámica artesanal de <a href="https://onomao.com" target="_blank" rel="noopener">onomao.com</a>.',
             fr: 'Un nouveau service de table et du matériel de cuisine pour de bons petits plats. Nous adorons la céramique artisanale signée <a href="https://onomao.com" target="_blank" rel="noopener">onomao.com</a>.',
             de: 'Ein neues Geschirr-Set und Küchenausstattung für viele Mahlzeiten zu Hause. Wir lieben das handgemachte Steingut von <a href="https://onomao.com" target="_blank" rel="noopener">onomao.com</a>.' },
  },
  {
    id: 'decoration', emoji: '🖼️', img: 'images/wedding-canvas.jpg', goal: 600, raised: 0, link: '',
    title: { en: 'One Wedding Canvas',     es: 'Un lienzo de nuestra boda', fr: 'Une toile de notre mariage', de: 'Eine Hochzeits-Leinwand' },
    desc:  { en: 'A canvas to remember our wedding day. We love the abstract pieces from <a href="https://www.kunstloft.de/abstrakte-wandbilder/?p=1&o=2&n=48&minWidth=150&minHeight=140" target="_blank" rel="noopener">kunstloft.de</a>.',
             es: 'Un lienzo para recordar el día de nuestra boda. Nos encantan las obras abstractas de <a href="https://www.kunstloft.de/abstrakte-wandbilder/?p=1&o=2&n=48&minWidth=150&minHeight=140" target="_blank" rel="noopener">kunstloft.de</a>.',
             fr: 'Une toile pour garder le souvenir de notre mariage. Nous adorons les œuvres abstraites de <a href="https://www.kunstloft.de/abstrakte-wandbilder/?p=1&o=2&n=48&minWidth=150&minHeight=140" target="_blank" rel="noopener">kunstloft.de</a>.',
             de: 'Eine Leinwand, die an unseren Hochzeitstag erinnert. Wir lieben die abstrakten Werke von <a href="https://www.kunstloft.de/abstrakte-wandbilder/?p=1&o=2&n=48&minWidth=150&minHeight=140" target="_blank" rel="noopener">kunstloft.de</a>.' },
  },
];

// UI strings for the registry (kept here so cards re-render on language change)
window.GIFTS_UI = {
  en: { contribute: 'Contribute', of: 'of', funded: 'funded', complete: 'Fully funded - thank you!',
        give: 'Give towards', choose: 'Choose an amount (you confirm the final amount on the next screen)',
        custom: 'Other', card: 'Contribute by card', soon: 'Card payments coming soon',
        or: 'or', scan: 'Scan with your phone camera to pay directly via Revolut.',
        sentq: 'Once you have paid, write your name and confirm:', namep: 'Your name', sent: 'I’ve sent it ✓', sending: 'One moment…',
        thanks: 'Thank you so much! The bar has been updated.',
        ty_label: 'With all our love', ty_title: 'Thank you', ty_msg: 'Your gift truly means the world to us.',
        oops: 'Something went wrong on our side - but thank you from the bottom of our hearts! Please just tell us about your gift directly.',
        mention: 'Please mention “{gift}” and your name in the payment note.',
        bank: 'Prefer a bank transfer? Use the details below.', secure: 'Card and Apple/Google Pay payments are handled securely by Revolut.' },
  es: { contribute: 'Contribuir', of: 'de', funded: 'financiado', complete: '¡Totalmente financiado - gracias!',
        give: 'Contribuir a', choose: 'Elige una cantidad (confirmarás el importe final en la siguiente pantalla)',
        custom: 'Otra', card: 'Contribuir con tarjeta', soon: 'Pagos con tarjeta próximamente',
        or: 'o', scan: 'Escanea con la cámara de tu móvil para pagar directamente por Revolut.',
        sentq: 'Cuando hayas pagado, escribe tu nombre y confirma:', namep: 'Tu nombre', sent: 'Ya lo envié ✓', sending: 'Un momento…',
        thanks: '¡Mil gracias! La barra se ha actualizado.',
        ty_label: 'Con todo nuestro cariño', ty_title: 'Gracias', ty_msg: 'Tu regalo significa muchísimo para nosotros.',
        oops: 'Algo falló por nuestra parte. ¡Pero gracias de todo corazón! Por favor, cuéntanos tu regalo directamente.',
        mention: 'Por favor menciona “{gift}” y tu nombre en la nota del pago.',
        bank: '¿Prefieres una transferencia? Usa los datos de abajo.', secure: 'Los pagos con tarjeta y Apple/Google Pay se procesan de forma segura con Revolut.' },
  fr: { contribute: 'Contribuer', of: 'sur', funded: 'financé', complete: 'Entièrement financé - merci !',
        give: 'Contribuer à', choose: 'Choisissez un montant (vous confirmez le montant final à l’écran suivant)',
        custom: 'Autre', card: 'Contribuer par carte', soon: 'Paiement par carte bientôt disponible',
        or: 'ou', scan: 'Scannez avec l’appareil photo de votre téléphone pour payer directement via Revolut.',
        sentq: 'Une fois le paiement effectué, écrivez votre nom et confirmez :', namep: 'Votre nom', sent: 'C’est envoyé ✓', sending: 'Un instant…',
        thanks: 'Merci beaucoup ! La barre a été mise à jour.',
        ty_label: 'Avec tout notre amour', ty_title: 'Merci', ty_msg: 'Votre cadeau nous touche énormément.',
        oops: 'Un petit souci de notre côté. Merci du fond du cœur quand même ! Dites-nous simplement votre cadeau directement.',
        mention: 'Merci d’indiquer « {gift} » et votre nom dans la note du paiement.',
        bank: 'Vous préférez un virement ? Utilisez les coordonnées ci-dessous.', secure: 'Les paiements par carte et Apple/Google Pay sont sécurisés par Revolut.' },
  de: { contribute: 'Beitragen', of: 'von', funded: 'finanziert', complete: 'Vollständig finanziert - danke!',
        give: 'Beitragen zu', choose: 'Wähle einen Betrag (den Endbetrag bestätigst du im nächsten Schritt)',
        custom: 'Andere', card: 'Mit Karte beitragen', soon: 'Kartenzahlung folgt in Kürze',
        or: 'oder', scan: 'Scanne den QR-Code mit deinem Handy, um direkt über Revolut zu zahlen.',
        sentq: 'Sobald du bezahlt hast, trag deinen Namen ein und bestätige:', namep: 'Dein Name', sent: 'Ist unterwegs ✓', sending: 'Einen Moment…',
        thanks: 'Vielen Dank! Der Balken wurde aktualisiert.',
        ty_label: 'Von ganzem Herzen', ty_title: 'Danke', ty_msg: 'Dein Geschenk bedeutet uns unendlich viel.',
        oops: 'Bei uns ist etwas schiefgelaufen. Trotzdem danke von Herzen! Sag uns einfach direkt Bescheid.',
        mention: 'Bitte gib „{gift}“ und deinen Namen im Verwendungszweck an.',
        bank: 'Lieber per Überweisung? Nutze die Daten unten.', secure: 'Karten- und Apple/Google-Pay-Zahlungen werden sicher über Revolut abgewickelt.' },
};

(function () {
  const grid = document.getElementById('registryGrid');
  if (!grid || !window.GIFTS) return;

  const LANGS = ['en', 'es', 'fr', 'de'];
  const SUGGESTED = [25, 50, 100, 250];
  const euro = n => '€' + Number(n).toLocaleString('en-US');

  // Live totals confirmed by guests (Netlify Function + Blobs). The bars show
  // gift.raised (manual base) + the live total. If the API is unreachable
  // (e.g. local preview without functions), bars just show the base numbers.
  const API = '/api/contributions';
  let LIVE = {};
  fetch(API)
    .then(r => (r.ok ? r.json() : {}))
    .then(t => { LIVE = t || {}; render(); })
    .catch(() => {});

  const raisedOf = g => g.raised + (LIVE[g.id] || 0);

  function currentLang() {
    const l = localStorage.getItem('wedding_lang') || (navigator.language || 'en').slice(0, 2);
    return LANGS.includes(l) ? l : 'en';
  }

  function render() {
    const lang = currentLang();
    const t = window.GIFTS_UI[lang];
    grid.innerHTML = '';
    window.GIFTS.forEach(g => {
      const raised = raisedOf(g);
      const pct = Math.min(100, Math.round((raised / g.goal) * 100));
      const done = raised >= g.goal;
      const card = document.createElement('article');
      card.className = 'reg-card' + (done ? ' reg-card--done' : '');
      // imgPos shifts the crop; imgFit:'contain' + imgBg letterboxes the full
      // image on a matching background (for photos that must not be cropped)
      const imgStyle = [
        g.imgPos ? `object-position:center ${g.imgPos}` : '',
        g.imgFit ? `object-fit:${g.imgFit}` : '',
        g.imgBg ? `background:${g.imgBg}` : '',
      ].filter(Boolean).join(';');
      const media = g.img
        ? `<div class="reg-card__photo"${g.imgBg ? ` style="background:${g.imgBg}"` : ''}><img src="${g.img}" alt="${g.title[lang]}" loading="lazy"${imgStyle ? ` style="${imgStyle}"` : ''}></div>`
        : `<div class="reg-card__emoji">${g.emoji}</div>`;
      card.innerHTML = `
        ${media}
        <h3 class="reg-card__title">${g.title[lang]}</h3>
        <p class="reg-card__desc">${g.desc[lang]}</p>
        <div class="reg-card__meta">
          <span class="reg-card__raised">${euro(raised)}</span>
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
      <div class="reg-modal__qr">
        <p class="reg-modal__or"></p>
        <img class="reg-modal__qrimg" alt="Revolut payment QR code">
        <p class="reg-modal__scan"></p>
      </div>
      <p class="reg-modal__note"></p>
      <div class="reg-modal__confirm">
        <p class="reg-modal__confirmq"></p>
        <input class="reg-modal__name" type="text" maxlength="80" autocomplete="name">
        <button class="reg-modal__sent"></button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ---- Thank-you celebration (shown after a guest confirms their gift) ----
  const party = document.createElement('div');
  party.className = 'reg-party';
  party.innerHTML = `
    <div class="reg-party__confetti" aria-hidden="true"></div>
    <div class="reg-party__inner">
      <p class="reg-party__label"></p>
      <h2 class="reg-party__title"></h2>
      <div class="divider">
        <svg viewBox="0 0 180 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="0.7" stroke-linecap="round">
          <line x1="0" y1="12" x2="68" y2="12"/>
          <line x1="112" y1="12" x2="180" y2="12"/>
          <path d="M90 4 L90 20"/>
          <path d="M90 8 C 86 7 82 9 80 12"/>
          <path d="M90 8 C 94 7 98 9 100 12"/>
          <path d="M90 14 C 86 13 82 15 80 18" opacity="0.6"/>
          <path d="M90 14 C 94 13 98 15 100 18" opacity="0.6"/>
        </svg>
      </div>
      <p class="reg-party__msg"></p>
      <p class="reg-party__sign">Monse <em>&</em> Mikel</p>
    </div>`;
  document.body.appendChild(party);
  let partyTimer = null;
  const closeParty = () => { party.classList.remove('open'); if (partyTimer) clearTimeout(partyTimer); };
  party.addEventListener('click', closeParty);

  function celebrate(name, lang) {
    const t = window.GIFTS_UI[lang];
    party.querySelector('.reg-party__label').textContent = t.ty_label;
    party.querySelector('.reg-party__title').textContent = t.ty_title + ', ' + name;
    party.querySelector('.reg-party__msg').textContent = t.ty_msg;
    const box = party.querySelector('.reg-party__confetti');
    box.innerHTML = '';
    const COLORS = ['#c9a86a', '#b08d4f', '#e8d9b5', '#a67c52', '#d9c08e'];
    for (let i = 0; i < 90; i++) {
      const s = document.createElement('span');
      const size = 4 + Math.random() * 6;
      s.style.left = Math.random() * 100 + '%';
      s.style.width = size + 'px';
      s.style.height = size * (0.35 + Math.random() * 0.5) + 'px';
      s.style.background = COLORS[i % COLORS.length];
      s.style.animationDuration = (3.5 + Math.random() * 3.5) + 's';
      s.style.animationDelay = (Math.random() * 1.5) + 's';
      box.appendChild(s);
    }
    party.classList.add('open');
    partyTimer = setTimeout(closeParty, 10000);
  }

  function openModal(g, lang) {
    const t = window.GIFTS_UI[lang];
    modal.querySelector('.reg-modal__emoji').textContent = g.emoji;
    modal.querySelector('.reg-modal__title').textContent = t.give + ' ' + g.title[lang];
    modal.querySelector('.reg-modal__desc').textContent = t.choose;
    const amounts = modal.querySelector('.reg-amounts');
    amounts.innerHTML = '';
    let selected = null;
    const deactivate = () => amounts.querySelectorAll('.reg-amount').forEach(x => x.classList.remove('active'));
    SUGGESTED.forEach(a => {
      const b = document.createElement('button');
      b.className = 'reg-amount';
      b.textContent = euro(a);
      b.addEventListener('click', () => {
        deactivate();
        b.classList.add('active');
        custom.classList.remove('open');
        selected = a;
      });
      amounts.appendChild(b);
    });
    // "Other" - free amount typed by the guest
    const other = document.createElement('button');
    other.className = 'reg-amount';
    other.textContent = t.custom;
    const custom = document.createElement('span');
    custom.className = 'reg-amount__custom';
    custom.innerHTML = '<span>€</span><input type="number" min="1" step="1" inputmode="numeric" placeholder="75">';
    other.addEventListener('click', () => {
      deactivate();
      other.classList.add('active');
      custom.classList.add('open');
      custom.querySelector('input').focus();
    });
    amounts.appendChild(other);
    amounts.appendChild(custom);
    const pay = modal.querySelector('.reg-modal__pay');
    const note = modal.querySelector('.reg-modal__note');
    const qr = modal.querySelector('.reg-modal__qr');
    const revolut = (window.PAY && window.PAY.revolutMe && window.PAY.revolutMe.indexOf('CHANGE_ME') === -1)
      ? window.PAY.revolutMe : '';
    const payUrl = g.link || revolut;
    if (payUrl) {
      pay.textContent = t.card;
      pay.href = payUrl;
      pay.classList.remove('is-disabled');
      pay.removeAttribute('aria-disabled');
      note.textContent = t.mention.replace('{gift}', g.title[lang]) + ' ' + t.secure + ' ' + t.bank;
    } else {
      pay.textContent = t.soon;
      pay.removeAttribute('href');
      pay.classList.add('is-disabled');
      pay.setAttribute('aria-disabled', 'true');
      note.textContent = t.bank;
    }
    if (revolut && window.PAY.qr) {
      modal.querySelector('.reg-modal__or').textContent = t.or;
      modal.querySelector('.reg-modal__qrimg').src = window.PAY.qr;
      modal.querySelector('.reg-modal__scan').textContent = t.scan;
      qr.style.display = '';
    } else {
      qr.style.display = 'none';
    }
    // Guest-confirmed contribution -> live bar update for everyone
    const confirmBox = modal.querySelector('.reg-modal__confirm');
    const confirmQ = modal.querySelector('.reg-modal__confirmq');
    const sentBtn = modal.querySelector('.reg-modal__sent');
    const nameInput = modal.querySelector('.reg-modal__name');
    if (payUrl) {
      confirmBox.style.display = '';
      confirmQ.textContent = t.sentq;
      nameInput.value = '';
      nameInput.placeholder = t.namep;
      nameInput.style.display = '';
      nameInput.classList.remove('is-missing');
      nameInput.oninput = () => nameInput.classList.remove('is-missing');
      sentBtn.textContent = t.sent;
      sentBtn.style.display = '';
      sentBtn.disabled = false;
      sentBtn.onclick = () => {
        const input = modal.querySelector('.reg-amount__custom input');
        const customOpen = modal.querySelector('.reg-amount__custom').classList.contains('open');
        const amt = customOpen ? Math.round(Number(input.value)) : selected;
        if (!amt || amt < 1) {
          // Amount is mandatory: flash the chips and bring them into view
          amounts.classList.add('is-missing');
          setTimeout(() => amounts.classList.remove('is-missing'), 1800);
          if (customOpen) input.focus();
          else amounts.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        const name = nameInput.value.trim();
        if (name.length < 2) { nameInput.classList.add('is-missing'); nameInput.focus(); return; }
        sentBtn.disabled = true;
        sentBtn.textContent = t.sending;
        fetch(API, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ gift: g.id, amount: amt, name: name }),
        })
          .then(r => { if (!r.ok) throw new Error('bad status'); return r.json(); })
          .then(totals => {
            LIVE = totals || LIVE;
            render();
            confirmQ.textContent = t.thanks;
            nameInput.style.display = 'none';
            sentBtn.style.display = 'none';
            closeModal();
            celebrate(name, lang);
          })
          .catch(() => {
            confirmQ.textContent = t.oops;
            nameInput.style.display = 'none';
            sentBtn.style.display = 'none';
          });
      };
    } else {
      confirmBox.style.display = 'none';
    }
    modal.classList.add('open');
  }
  function closeModal() { modal.classList.remove('open'); }

  render();
  // Re-render cards when the visitor switches language
  document.querySelectorAll('[data-lang]').forEach(btn =>
    btn.addEventListener('click', () => setTimeout(render, 0)));
})();
