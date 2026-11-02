(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // menu
  const toggle = $('.menu-toggle'), links = $('.nav-links');
  const closeMenu = () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  toggle.addEventListener('click', () => { const o = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!o)); links.classList.toggle('open'); document.body.classList.toggle('menu-open', !o); });
  $$('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));
  // dialogs
  $$('[data-dialog]').forEach(b => b.addEventListener('click', () => $('#' + b.dataset.dialog).showModal()));
  $$('.dialog-close').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
  // reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));
  // scroll progress + active link
  const bar = $('.progress'), secs = $$('main section[id]'), nav = $$('.nav-links a');
  const onScroll = () => {
    const h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    let cur = ''; secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
    nav.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // typing roles
  const typed = $('.typed'), roles = ['Frontend Web Developer', 'UI/UX Enthusiast', 'Laravel Builder', 'Mahasiswa D4 MI UNESA'];
  if (reduce) typed.textContent = roles[0]; else {
    let r = 0, c = 0, del = false;
    (function tick() {
      const w = roles[r]; typed.textContent = w.slice(0, c);
      if (!del && c === w.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
      c += del ? -1 : 1; setTimeout(tick, del ? 35 : 70);
    })();
  }
  // counters
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = to + suf; return; }
    const t0 = performance.now();
    (function step(t) { const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); })(t0);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));
  if (reduce) return;
  // cursor glow
  const glow = $('.cursor-glow');
  addEventListener('pointermove', e => { glow.style.opacity = 1; glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });
  // card spotlight
  $$('.project-card').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }));
  // 3D tilt photo
  const card = $('.photo-card');
  if (card) {
    card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`; });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  }
  // magnetic buttons
  $$('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });
})();
