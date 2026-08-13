// ═══════════ СЧЁТЧИК «МЫ ВМЕСТЕ» с 9 марта 2026 ═══════════
const startDate = new Date('2026-03-09T00:00:00');

function updateTimer() {
  let diff = new Date() - startDate;
  if (diff < 0) diff = 0;
  document.getElementById('days').textContent    = Math.floor(diff / 86400000);
  document.getElementById('hours').textContent   = Math.floor(diff / 3600000) % 24;
  document.getElementById('minutes').textContent = Math.floor(diff / 60000) % 60;
  document.getElementById('seconds').textContent = Math.floor(diff / 1000) % 60;
}
updateTimer();
setInterval(updateTimer, 1000);

// ═══════════ Плавное появление карточек ═══════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.event').forEach((el) => observer.observe(el));

// ═══════════ Летающие сердечки ═══════════
const heartsContainer = document.getElementById('hearts');
const symbols = ['♥', '♡', '❤'];
function createHeart() {
  const heart = document.createElement('span');
  heart.className = 'heart-float';
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = 12 + Math.random() * 20 + 'px';
  heart.style.animationDuration = 8 + Math.random() * 8 + 's';
  heart.style.opacity = 0.2 + Math.random() * 0.4;
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 17000);
}
setInterval(createHeart, 900);
for (let i = 0; i < 10; i++) setTimeout(createHeart, i * 300);

// ═══════════ ПИСЬМО 💌 ══════════
const letterOverlay = document.getElementById('letterOverlay');
const openLetterBtn = document.getElementById('openLetter');
const closeLetterBtn = document.getElementById('closeLetter');

function openLetter() {
  letterOverlay.classList.add('open');
  document.body.classList.add('no-scroll');
}
function closeLetter() {
  letterOverlay.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

openLetterBtn.addEventListener('click', openLetter);
closeLetterBtn.addEventListener('click', closeLetter);
letterOverlay.addEventListener('click', (e) => {
  if (e.target === letterOverlay) closeLetter();
});

// ═══════════ ВИДЕО «НАША СКАЗКА» 🎬 ═══════════
const videoOverlay = document.getElementById('videoOverlay');
const openVideoBtn = document.getElementById('openVideo');
const closeVideoBtn = document.getElementById('closeVideo');
const fairyVideo = document.getElementById('fairyVideo');

function openVideo() {
  videoOverlay.classList.add('open');
  document.body.classList.add('no-scroll');
}
function closeVideo() {
  videoOverlay.classList.remove('open');
  document.body.classList.remove('no-scroll');
  fairyVideo.pause(); // чтобы звук не играл после закрытия окна
}

openVideoBtn.addEventListener('click', openVideo);
closeVideoBtn.addEventListener('click', closeVideo);
videoOverlay.addEventListener('click', (e) => {
  if (e.target === videoOverlay) closeVideo();
});

// ═══════════ ПОЛНОЭКРАННЫЙ ПРОСМОТР ФОТО 🔍 ═══════════
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lbSlides = [];
let lbIndex = 0;

function lbShow(i) {
  if (lbSlides.length === 0) return;
  lbIndex = (i + lbSlides.length) % lbSlides.length;
  const img = lbSlides[lbIndex].querySelector('img');
  if (img) lightboxImg.src = img.src;
}
function lbOpen(slides, startIndex) {
  lbSlides = slides;
  lbShow(startIndex);
  lightbox.classList.add('open');
  document.body.classList.add('no-scroll');
}
function lbClose() {
  lightbox.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

document.getElementById('lightboxClose').addEventListener('click', lbClose);
document.getElementById('lightboxPrev').addEventListener('click', () => lbShow(lbIndex - 1));
document.getElementById('lightboxNext').addEventListener('click', () => lbShow(lbIndex + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose(); });

// Свайп в полноэкранном просмотре
let lbStartX = 0;
lightbox.addEventListener('touchstart', (e) => { lbStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - lbStartX;
  if (dx < -50) lbShow(lbIndex + 1);
  if (dx >  50) lbShow(lbIndex - 1);
});

// Клавиша Esc закрывает письмо, видео и просмотр фото
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeLetter(); closeVideo(); lbClose(); }
});

// ═══════════ СЛАЙДЕРЫ ФОТОГРАФИЙ ═══════════
document.querySelectorAll('.slider').forEach((slider) => {
  const track    = slider.querySelector('.slider-track');
  const slides   = slider.querySelectorAll('.slide');
  const prevBtn  = slider.querySelector('.slider-arrow--prev');
  const nextBtn  = slider.querySelector('.slider-arrow--next');
  const expandBtn = slider.querySelector('.slider-expand');
  const dotsBox  = slider.querySelector('.slider-dots');
  const curLabel = slider.querySelector('.slider-current');
  const totLabel = slider.querySelector('.slider-total');

  let current = 0;
  const total = slides.length;
  if (total === 0) return;

  // Создаём точки-индикаторы
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  }
  const dots = dotsBox.querySelectorAll('.slider-dot');
  totLabel.textContent = total;

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    curLabel.textContent = current + 1;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Кнопка 🔍 — открыть текущее фото на весь экран
  if (expandBtn) {
    expandBtn.addEventListener('click', () => lbOpen(Array.from(slides), current));
  }

  // ═══ СВАЙП на телефоне ═══
  let startX = 0, startY = 0, deltaX = 0, dragging = false, isHorizontal = null;

  function onStart(e) {
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX;
    startY = point.clientY;
    deltaX = 0;
    dragging = true;
    isHorizontal = null;
    track.classList.add('dragging');
  }

  function onMove(e) {
    if (!dragging) return;
    const point = e.touches ? e.touches[0] : e;
    deltaX = point.clientX - startX;
    const deltaY = point.clientY - startY;

    if (isHorizontal === null && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    }
    if (isHorizontal && e.cancelable) e.preventDefault();

    if (isHorizontal) {
      const offset = -current * track.offsetWidth + deltaX;
      track.style.transform = `translateX(${offset}px)`;
    }
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');

    if (isHorizontal) {
      const threshold = track.offsetWidth / 4;
      if (deltaX < -threshold)     goTo(current + 1);
      else if (deltaX > threshold) goTo(current - 1);
      else                         goTo(current);
    }
    isHorizontal = null;
  }

  track.addEventListener('touchstart',  onStart, { passive: true });
  track.addEventListener('touchmove',   onMove,  { passive: false });
  track.addEventListener('touchend',    onEnd);
  track.addEventListener('touchcancel', onEnd);

  // Свайп мышкой (для проверки на компьютере)
  track.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup',   onEnd);

  // Клавиши ← → (работает только для слайдера на экране)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const rect = slider.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  goTo(0); // Инициализация
});