/* Panedodo – kleine Interaktionen: Tabs, Quiz, Nach-oben-Button */
(() => {
  /* ---------- Tabs (Panedodo-Weg) ---------- */
  const tabs = document.querySelector('.tabs');
  const links = [...document.querySelectorAll('.tabs__link')];
  const indicator = document.querySelector('.tabs__indicator');

  function moveIndicator(link) {
    if (!tabs || !link) return;
    const navBox = tabs.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    const width = Math.max(box.width, Math.min(170, navBox.width / links.length));
    const left = Math.min(box.left - navBox.left, navBox.width - width);
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${left}px)`;
  }
  function setActive(link) {
    links.forEach(l => {
      const active = l === link;
      l.classList.toggle('is-active', active);
      if (active) l.setAttribute('aria-current', 'step'); else l.removeAttribute('aria-current');
    });
    moveIndicator(link);
  }
  links.forEach(l => l.addEventListener('click', () => setActive(l)));

  // Aktiven Schritt beim Scrollen mitführen
  const steps = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && steps.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const link = links.find(l => l.getAttribute('href') === `#${e.target.id}`);
          if (link) setActive(link);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => io.observe(s));
  }
  window.addEventListener('resize', () => moveIndicator(document.querySelector('.tabs__link.is-active')));
  requestAnimationFrame(() => moveIndicator(links[0]));

  /* ---------- Quiz ----------
     Nur die erste Frage stammt aus dem Design. Fragen 2–3 und die
     Resultate sind Platzhalter – einfach hier anpassen. */
  const QUESTIONS = [
    { q: 'Lieber Knusprig oder Weich?', a: [['Knusprig', 'k'], ['Weich', 'w']] },
    { q: 'Lieber Süss oder Salzig?',     a: [['Süss', 's'], ['Salzig', 'z']] },
    { q: 'Zmorge oder Apéro?',           a: [['Zmorge', 'm'], ['Apéro', 'a']] },
  ];
  const RESULTS = {
    k: { z: 'Baguette', s: 'Nusstorte' },
    w: { z: 'Laugenbrötli', s: 'Butterzopf' },
  };

  const form = document.querySelector('[data-quiz]');
  if (form) {
    const qEl = form.querySelector('[data-question]');
    const aEl = form.querySelector('[data-answers]');
    const next = form.querySelector('[data-next]');
    const result = form.querySelector('[data-result]');
    const step = form.querySelector('.quiz__step');
    const bar = form.querySelector('.progress__bar');
    const progress = form.querySelector('.progress');
    let i = 0;
    const picks = [];

    function render() {
      const { q, a } = QUESTIONS[i];
      qEl.textContent = q;
      aEl.innerHTML = a.map(([label, val]) =>
        `<label class="answer"><input type="radio" name="q${i}" value="${val}" required>${label}</label>`
      ).join('');
      next.disabled = true;
      next.textContent = i === QUESTIONS.length - 1 ? 'Resultat' : 'Next';
      bar.style.width = `${((i + 1) / QUESTIONS.length) * 100}%`;
      progress.setAttribute('aria-valuenow', i + 1);
    }
    aEl.addEventListener('change', () => { next.disabled = false; });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (step.hidden) { // Neustart
        i = 0; picks.length = 0; step.hidden = false; result.hidden = true; render(); return;
      }
      const checked = form.querySelector(`input[name="q${i}"]:checked`);
      if (!checked) return;
      picks.push(checked.value);
      if (++i < QUESTIONS.length) { render(); aEl.querySelector('input')?.focus(); return; }
      const product = (RESULTS[picks[0]] || {})[picks[1]] || 'Rosmarin-Focaccia';
      step.hidden = true;
      result.hidden = false;
      result.innerHTML = `Deine Crustität ist<strong>${product}</strong>`;
      next.textContent = 'Nochmals';
      next.disabled = false;
    });
    render();
  }

  /* ---------- Nach oben ---------- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    const onScroll = () => toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
