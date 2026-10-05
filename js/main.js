// 문의 이메일을 입력하면 문의 섹션에 버튼이 표시됩니다. 예: 'hello@your-domain.com'
const CONTACT_EMAIL = '';

document.documentElement.classList.add('js');

// ── 헤더: 스크롤 시 배경 표시 ──
(function header() {
  const el = document.getElementById('header');
  const update = () => el.classList.toggle('is-solid', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// ── 모바일 메뉴 ──
(function menu() {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');
  const set = (open) => {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
})();

// ── 문의 섹션 배경의 관람차 라인 아트 (CI 심볼 기반) ──
(function drawWheel() {
  const svg = document.getElementById('wheel');
  if (!svg) return;
  const GOLD = '#d6b36e';
  const C = 300, R = 240, N = 10;
  const f = (n) => n.toFixed(1);
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return [C + R * Math.cos(a), C + R * Math.sin(a)];
  });
  const ring = (s) => pts.map(([x, y]) => `${f(C + (x - C) * s)},${f(C + (y - C) * s)}`).join(' ');
  const spokes = pts.map(([x, y]) => `<line x1="${C}" y1="${C}" x2="${f(x)}" y2="${f(y)}"/>`).join('');
  const cabs = pts.map(([x, y]) => `
    <g transform="translate(${f(x)} ${f(y)})"><g class="counter">
      <circle r="26"/><path d="M-26 0H26M0-26V0"/>
    </g></g>`).join('');

  svg.innerHTML = `
    <g class="spin" fill="none" stroke="${GOLD}" stroke-width="1.5">
      ${spokes}
      <polygon points="${ring(1)}"/>
      <polygon points="${ring(0.6)}"/>
      <circle cx="${C}" cy="${C}" r="18"/>
      <g fill="#0b0d12">${cabs}</g>
    </g>`;
})();

// ── 스크롤 등장 효과 ──
(function reveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
})();

// ── 게임 상세 페이지: 갤러리 크게 보기 ──
(function lightbox() {
  const shots = [...document.querySelectorAll('.shot')];
  if (!shots.length) return;
  let box = null;
  let current = 0;
  const close = () => {
    if (!box) return;
    box.remove();
    box = null;
    document.body.style.overflow = '';
    shots[current].focus();
  };
  const show = (i) => {
    current = (i + shots.length) % shots.length;
    const thumb = shots[current].querySelector('img');
    const img = box.querySelector('img');
    img.src = shots[current].dataset.full;
    img.alt = thumb.alt;
    img.className = thumb.className;
  };
  const open = (i) => {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', '이미지 크게 보기');
    box.innerHTML = '<button class="lightbox__close" type="button" aria-label="닫기">×</button><img alt="">';
    box.addEventListener('click', close);
    document.body.appendChild(box);
    document.body.style.overflow = 'hidden';
    show(i);
    box.querySelector('button').focus();
  };
  shots.forEach((s, i) => s.addEventListener('click', () => open(i)));
  window.addEventListener('keydown', (e) => {
    if (!box) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });
})();

// ── 문의 버튼 ──
(function contact() {
  const btn = document.getElementById('contact-btn');
  if (!CONTACT_EMAIL || !btn) return;
  btn.href = `mailto:${CONTACT_EMAIL}`;
  btn.textContent = CONTACT_EMAIL;
  btn.hidden = false;
  document.getElementById('contact-pending').hidden = true;
})();
