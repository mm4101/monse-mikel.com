// ============================================================
//  Background music. It starts ONLY when the visitor clicks the
//  "Enter" button on the welcome overlay (that click is also the
//  browser gesture that permits audio). After that, the floating
//  button in the corner mutes / unmutes it. There is no
//  auto-start on page load or on stray taps.
//  If the audio file is missing, the control hides itself.
//  Audio source: music/our-song.mp3 (self-hosted).
// ============================================================
(function () {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggle');
  if (!audio || !btn) return;

  const KEY_POS = 'music_pos';

  // No playable file yet -> hide the control rather than show a dead button.
  audio.addEventListener('error', () => { btn.hidden = true; });

  // Resume where we left off earlier this session (across page loads).
  const savedPos = parseFloat(sessionStorage.getItem(KEY_POS));
  if (!isNaN(savedPos)) {
    audio.addEventListener('loadedmetadata', () => {
      if (savedPos > 0 && savedPos < audio.duration) {
        try { audio.currentTime = savedPos; } catch (e) { /* ignore */ }
      }
    });
  }
  setInterval(() => { if (!audio.paused) sessionStorage.setItem(KEY_POS, audio.currentTime); }, 1000);

  function setUI(playing) {
    btn.classList.toggle('music-toggle--playing', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? 'Mute music' : 'Unmute music');
  }
  function play() { audio.play().then(() => setUI(true)).catch(() => setUI(false)); }
  function pause() { audio.pause(); setUI(false); }

  setUI(false);

  // Mute / unmute - the guest's own control, after the music is on.
  btn.addEventListener('click', () => { if (audio.paused) play(); else pause(); });

  // Entrance overlay: clicking "Enter" is the ONLY thing that starts the song.
  // (A <button> is also activated by keyboard Enter/Space for free.)
  const overlay = document.getElementById('enterOverlay');
  const enterBtn = document.getElementById('enterBtn');
  if (overlay) {
    if (sessionStorage.getItem('entered_v2') === '1') {
      overlay.classList.add('enter--hidden');
    } else if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        sessionStorage.setItem('entered_v2', '1');
        overlay.classList.add('enter--hidden');
        play();
      });
    }
  }
})();
