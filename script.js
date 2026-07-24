// ============================================================
//  Wedding website — language switcher + nav toggle
// ============================================================

const langButtons = document.querySelectorAll('[data-lang]');
const savedLang = localStorage.getItem('wedding_lang') || (navigator.language || 'en').slice(0, 2);
const initialLang = ['en', 'es', 'fr', 'de'].includes(savedLang) ? savedLang : 'en';

function setLanguage(lang) {
  if (!translations[lang]) return;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (translations[lang][key]) el.innerHTML = translations[lang][key];
  });
  langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  localStorage.setItem('wedding_lang', lang);
}

langButtons.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});
setLanguage(initialLang);

// Mobile nav toggle
const navToggle = document.querySelector('.topnav__toggle');
const navLinks = document.querySelector('.topnav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => { e.stopPropagation(); navLinks.classList.toggle('open'); });
  // Close the menu when tapping outside it
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Active page highlighting
const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
document.querySelectorAll('.topnav__links a[data-page]').forEach(a => {
  if (a.dataset.page === path) a.classList.add('active');
});

// Countdown
function pad(n) { return String(n).padStart(2, '0'); }
function tickCountdown() {
  document.querySelectorAll('.countdown').forEach(cd => {
    const target = new Date(cd.dataset.target).getTime();
    const diff = target - Date.now();
    if (diff <= 0) {
      cd.querySelectorAll('.countdown__num').forEach(n => n.textContent = '00');
      return;
    }
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    cd.querySelector('[data-unit="d"]').textContent = days;
    cd.querySelector('[data-unit="h"]').textContent = pad(hours);
    cd.querySelector('[data-unit="m"]').textContent = pad(minutes);
    cd.querySelector('[data-unit="s"]').textContent = pad(seconds);
  });
}
tickCountdown();
setInterval(tickCountdown, 1000);
