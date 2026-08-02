// ============================================================
//  WhatsApp channel interest - guests tap + to say they'd like
//  a dedicated channel (English / Spanish / French). A small
//  human check guards the counter; counts are stored via
//  /api/whatsapp-interest (Netlify Function + Blobs).
// ============================================================
(function () {
  const grid = document.getElementById('waGrid');
  if (!grid) return;

  const API = '/api/whatsapp-interest';
  const CHANNELS = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'fr', name: 'Français' },
  ];
  const UI = {
    en: { interested: 'interested', btn: 'I’m interested', check: 'A quick check that you’re human:',
          confirm: 'Confirm', wrong: 'Hmm, try again 😉', done: 'Noted - thank you!',
          already: 'You’re on the list ✓', fail: 'That didn’t go through - please try again later.' },
    es: { interested: 'interesados', btn: 'Me interesa', check: 'Una pequeña comprobación de que eres humano:',
          confirm: 'Confirmar', wrong: 'Mmm, inténtalo otra vez 😉', done: '¡Anotado, gracias!',
          already: 'Estás en la lista ✓', fail: 'No se pudo registrar. Inténtalo más tarde.' },
    fr: { interested: 'intéressés', btn: 'Ça m’intéresse', check: 'Une petite vérification que vous êtes humain :',
          confirm: 'Confirmer', wrong: 'Hmm, réessayez 😉', done: 'C’est noté, merci !',
          already: 'Vous êtes sur la liste ✓', fail: 'Ça n’a pas fonctionné. Réessayez plus tard.' },
    de: { interested: 'interessiert', btn: 'Ich bin dabei', check: 'Ein kurzer Check, dass du ein Mensch bist:',
          confirm: 'Bestätigen', wrong: 'Hmm, versuch’s nochmal 😉', done: 'Notiert, danke!',
          already: 'Du stehst auf der Liste ✓', fail: 'Hat gerade nicht geklappt. Versuch es später noch mal.' },
  };
  const LANGS = ['en', 'es', 'fr', 'de'];

  function currentLang() {
    const l = localStorage.getItem('wedding_lang') || (navigator.language || 'en').slice(0, 2);
    return LANGS.includes(l) ? l : 'en';
  }

  let COUNTS = {};
  fetch(API)
    .then(r => (r.ok ? r.json() : {}))
    .then(c => { COUNTS = c || {}; render(); })
    .catch(() => {});

  const alreadyDone = id => localStorage.getItem('wa_interest_' + id) === '1';

  function render() {
    const t = UI[currentLang()];
    grid.innerHTML = '';
    CHANNELS.forEach(ch => {
      const n = COUNTS[ch.id] || 0;
      const isDone = alreadyDone(ch.id);
      const card = document.createElement('div');
      card.className = 'wa-card' + (isDone ? ' wa-card--done' : '');
      card.innerHTML = `
        <p class="wa-card__name">${ch.name}</p>
        <button class="wa-card__plus" aria-label="${t.btn}">${isDone ? '✓' : '+'}</button>
        <p class="wa-card__count"><strong>${n}</strong> ${t.interested}</p>
        <p class="wa-card__hint">${isDone ? t.already : t.btn}</p>`;
      const btn = card.querySelector('.wa-card__plus');
      if (isDone) btn.disabled = true;
      else btn.addEventListener('click', () => openCheck(ch));
      grid.appendChild(card);
    });
  }

  // ---- Human-check dialog ----
  const modal = document.createElement('div');
  modal.className = 'wa-modal';
  modal.innerHTML = `
    <div class="wa-modal__overlay" data-close></div>
    <div class="wa-modal__box" role="dialog" aria-modal="true">
      <button class="wa-modal__close" data-close aria-label="Close">×</button>
      <p class="wa-modal__q"></p>
      <p class="wa-modal__sum"></p>
      <input class="wa-modal__input" type="number" inputmode="numeric">
      <button class="btn btn--rosa wa-modal__confirm"></button>
      <p class="wa-modal__note"></p>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelectorAll('[data-close]').forEach(el =>
    el.addEventListener('click', () => modal.classList.remove('open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });

  function openCheck(ch) {
    const t = UI[currentLang()];
    const a = 2 + Math.floor(Math.random() * 7);
    const b = 2 + Math.floor(Math.random() * 7);
    const answer = a + b;
    modal.querySelector('.wa-modal__q').textContent = t.check;
    modal.querySelector('.wa-modal__sum').textContent = a + ' + ' + b + ' = ?';
    const input = modal.querySelector('.wa-modal__input');
    const btn = modal.querySelector('.wa-modal__confirm');
    const note = modal.querySelector('.wa-modal__note');
    input.value = '';
    note.textContent = '';
    btn.textContent = t.confirm;
    btn.disabled = false;
    modal.classList.add('open');
    input.focus();
    btn.onclick = () => {
      if (Math.round(Number(input.value)) !== answer) {
        note.textContent = t.wrong;
        input.value = '';
        input.focus();
        return;
      }
      btn.disabled = true;
      fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ channel: ch.id }),
      })
        .then(r => { if (!r.ok) throw new Error('bad status'); return r.json(); })
        .then(counts => {
          COUNTS = counts || COUNTS;
          localStorage.setItem('wa_interest_' + ch.id, '1');
          render();
          note.textContent = t.done;
          setTimeout(() => modal.classList.remove('open'), 1200);
        })
        .catch(() => {
          note.textContent = t.fail;
          btn.disabled = false;
        });
    };
    input.onkeydown = e => { if (e.key === 'Enter') btn.click(); };
  }

  // Re-render on language switch
  document.querySelectorAll('[data-lang]').forEach(b =>
    b.addEventListener('click', () => setTimeout(render, 0)));
})();
