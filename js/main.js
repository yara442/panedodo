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

  document.querySelectorAll('.card__media--toggle').forEach(button => {
    function toggleImage() {
      const active = button.classList.toggle('is-alternate');
      button.setAttribute('aria-pressed', String(active));
    }
    button.addEventListener('pointerup', event => {
      if (event.pointerType !== 'mouse') toggleImage();
    });
    button.addEventListener('click', event => {
      if (event.detail === 0) toggleImage();
    });
  });

  const fadeInImages = [...document.querySelectorAll('[data-fade-in]')];
  if (fadeInImages.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-fade-visible');
        entry.target.classList.remove('is-fade-pending');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    fadeInImages.forEach(image => {
      image.classList.add('is-fade-pending');
      fadeObserver.observe(image);
    });
  }

  const contactForm = document.querySelector('.env__letter');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const email = String(formData.get('email') || '').trim();
    const comment = String(formData.get('message') || '').trim();
    const body = [comment, email && `Absender: ${email}`].filter(Boolean).join('\n\n');
    const subject = encodeURIComponent('Kontaktanfrage über Panedodo');
    window.location.href = `mailto:ciao@panedodo.ch?subject=${subject}&body=${encodeURIComponent(body)}`;
  });

  const heroStars = [...document.querySelectorAll('.hero__star, .hero__star-mobile')];
  const baguette = document.querySelector('.hero__baguette');
  const quizPaper = document.querySelector('.quiz__paper');
  const quizBackground = document.querySelector('.quiz__bg');
  const greenZone = document.querySelector('.green-zone');
  const kontaktStage = document.querySelector('.kontakt__stage');
  const kontaktForm = kontaktStage?.querySelector('.kontakt__form');
  const miseIngredients = [...document.querySelectorAll('.mise__ingredient')];
  const parallaxBubbles = [...document.querySelectorAll('.kneten__bubble, .aufgehen__bubble')];
  const parallaxTitles = [...document.querySelectorAll('[data-title-parallax-range]')];
  const wegParallaxElements = [...document.querySelectorAll('.weg .body-element__media, .weg .body-element__text')];
  if (heroStars.length || baguette || quizPaper || quizBackground || greenZone || kontaktStage || miseIngredients.length || parallaxBubbles.length || parallaxTitles.length || wegParallaxElements.length) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let framePending = false;
    const updateParallax = () => {
      const heroStarOffset = reducedMotion.matches ? 0 : Math.min(window.scrollY * 0.07, 60);
      heroStars.forEach(star => star.style.setProperty('--hero-star-parallax-y', `${heroStarOffset}px`));
      if (baguette) {
        const baguetteOffset = reducedMotion.matches ? 0 : Math.min(window.scrollY * 0.12, 100);
        baguette.style.setProperty('--parallax-y', `${baguetteOffset}px`);
      }
      if (quizPaper) {
        const bounds = quizPaper.getBoundingClientRect();
        const centerDistance = bounds.top + bounds.height / 2 - window.innerHeight / 2;
        const paperOffset = reducedMotion.matches ? 0 : Math.max(-60, Math.min(60, -centerDistance * 0.08));
        quizPaper.style.setProperty('--quiz-paper-parallax-y', `${paperOffset}px`);
      }
      if (quizBackground) {
        const bounds = quizBackground.getBoundingClientRect();
        const centerDistance = bounds.top + bounds.height / 2 - window.innerHeight / 2;
        const backgroundOffset = reducedMotion.matches ? 0 : Math.max(-45, Math.min(45, -centerDistance * 0.08));
        quizBackground.style.setProperty('--quiz-bg-parallax-y', `${backgroundOffset}px`);
      }
      if (greenZone) {
        const bounds = greenZone.getBoundingClientRect();
        const centerDistance = bounds.top - window.innerHeight * 0.55;
        const backgroundOffset = reducedMotion.matches ? 0 : Math.max(-50, Math.min(50, -centerDistance * 0.06));
        greenZone.style.setProperty('--green-bg-parallax-y', `${backgroundOffset}px`);
      }
      if (kontaktStage && kontaktForm) {
        const bounds = kontaktForm.getBoundingClientRect();
        const currentOffset = Number.parseFloat(kontaktStage.style.getPropertyValue('--kontakt-stage-parallax-y')) || 0;
        const centerDistance = bounds.top + bounds.height / 2 - currentOffset - window.innerHeight / 2;
        const kontaktOffset = reducedMotion.matches ? 0 : Math.max(-60, Math.min(60, -centerDistance * 0.08));
        kontaktStage.style.setProperty('--kontakt-stage-parallax-y', `${kontaktOffset}px`);
      }
      miseIngredients.forEach(ingredient => {
        const range = Number.parseFloat(ingredient.dataset.parallaxRange) || 0;
        const bounds = ingredient.getBoundingClientRect();
        const currentOffset = Number.parseFloat(ingredient.style.getPropertyValue('--mise-parallax-y')) || 0;
        const centerDistance = bounds.top + bounds.height / 2 - currentOffset - window.innerHeight / 2;
        const offset = reducedMotion.matches ? 0 : Math.max(-range, Math.min(range, -centerDistance * 0.08));
        ingredient.style.setProperty('--mise-parallax-y', `${offset}px`);
      });
      parallaxBubbles.forEach(bubble => {
        const range = Number.parseFloat(bubble.dataset.parallaxRange) || 0;
        const bounds = bubble.getBoundingClientRect();
        const currentOffset = Number.parseFloat(bubble.style.getPropertyValue('--bubble-parallax-y')) || 0;
        const centerDistance = bounds.top + bounds.height / 2 - currentOffset - window.innerHeight / 2;
        const offset = reducedMotion.matches ? 0 : Math.max(-range, Math.min(range, -centerDistance * 0.08));
        bubble.style.setProperty('--bubble-parallax-y', `${offset}px`);
      });
      parallaxTitles.forEach(title => {
        const range = Number.parseFloat(title.dataset.titleParallaxRange) || 0;
        const bounds = title.getBoundingClientRect();
        const currentOffset = Number.parseFloat(title.style.getPropertyValue('--title-parallax-y')) || 0;
        const centerDistance = bounds.top + bounds.height / 2 - currentOffset - window.innerHeight / 2;
        const offset = reducedMotion.matches ? 0 : Math.max(-range, Math.min(range, -centerDistance * 0.08));
        title.style.setProperty('--title-parallax-y', `${offset}px`);
      });
      wegParallaxElements.forEach(element => {
        const bounds = element.getBoundingClientRect();
        const currentOffset = Number.parseFloat(element.style.getPropertyValue('--weg-parallax-y')) || 0;
        const centerDistance = bounds.top + bounds.height / 2 - currentOffset - window.innerHeight / 2;
        const offset = reducedMotion.matches ? 0 : Math.max(-30, Math.min(30, -centerDistance * 0.08));
        element.style.setProperty('--weg-parallax-y', `${offset}px`);
      });
      framePending = false;
    };
    const onScroll = () => {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(updateParallax);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateParallax();
  }

  /* ---------- Quiz ---------- */
  const QUESTIONS = [
    { q: '«Harte Schale, weicher Kern», trifft das auf dich zu?', a: [
      ['Nö', ['Butterzopf', 'Party-Brötchen']],
      ['Yep', ['Nusstorte', 'Weihnachtsguetsli']],
    ] },
    { q: 'Alles ist besser, wenn es süss ist.', a: [
      ['Agree', ['Nusstorte', 'Weihnachtsguetsli']],
      ['Disagree', ['Butterzopf', 'Party-Brötchen']],
    ] },
    { q: 'Wie gehst du an Aufgaben ran? Immer mal wieder ein bisschen oder einmal, aber dann richtig.', a: [
      ['Mit Babyschritten ist alles zu meistern.', ['Weihnachtsguetsli', 'Party-Brötchen']],
      ['Alles zusammen, und dann ist es durch.', ['Nusstorte', 'Butterzopf']],
    ] },
    { q: 'Was ist deine Meinung zu Weihnachtsliedern?', a: [
      ['Konstant ab November.', ['Weihnachtsguetsli', 'Party-Brötchen']],
      ['Am 24. Dez. und keinen Tag früher oder später.', ['Nusstorte', 'Butterzopf']],
    ] },
    { q: 'Was sind deine Wochenendpläne?', a: [
      ['Ausschlafen und dann vielleicht ein Brunch.', ['Butterzopf']],
      ['Ich habe bereits mit 10 Personen in 4 Städten abgemacht.', ['Party-Brötchen']],
    ] },
    { q: 'Was bist du eher?', a: [
      ['Einzelgänger', ['Weihnachtsguetsli', 'Party-Brötchen']],
      ['Team-Player', ['Nusstorte', 'Butterzopf']],
    ] },
    { q: 'Was ist deine Geschirrspül-Herangehensweise?', a: [
      ['Vorspülen und rein damit.', ['Butterzopf', 'Party-Brötchen']],
      ['Zuerst lassen wir’s mal einweichen.', ['Nusstorte', 'Weihnachtsguetsli']],
    ] },
    { q: 'Wie wichtig ist es dir, ein gutes Outfit zu haben?', a: [
      ['Sehr!', ['Butterzopf', 'Party-Brötchen']],
      ['Eh… Auf die inneren Werte kommt es an.', ['Nusstorte', 'Weihnachtsguetsli']],
    ] },
    { q: 'Welche Getränke entsprechen dir?', a: [
      ['Ein Macchiato oder eine warme Schoggi', ['Weihnachtsguetsli']],
      ['Schwarztee oder ein guter Espresso', ['Nusstorte']],
    ] },
  ];
  const RESULTS = {
    Nusstorte: 'Du bist eine Nusstorte! Du hast vielleicht eine etwas harte Schale, aber dein Kern ist unglaublich süss und gehaltvoll. Du bist bodenständig und hast ordentlich Substanz. Auf dich kann man sich lange verlassen – du gehst so schnell nicht kaputt!',
    Butterzopf: 'Du bist ein Butterzopf! Du bist der Inbegriff von Gemütlichkeit und Harmonie. Ohne dich ist ein entspanntes Wochenende kein echtes Wochenende. Alle lieben dich, du bringst die Menschen am Tisch zusammen.',
    'Party-Brötchen': 'Du bist ein Party-Brötchen! Gesellig, vielseitig und immer da, wo was los ist! Du brauchst keine stundenlange Vorbereitung, um der Star des Abends zu sein. Du bist der perfekte Begleiter für spontane Aktionen.',
    Weihnachtsguetsli: 'Du bist ein Weihnachtsguetsli! Du bist voller Freude und Energie! Du verbreitest gute Laune und machst den Alltag ein bisschen bunter und süsser. Du bist ein echter Geniesser mit einer knusprigen Schale und einem weichen Kern. Stress lässt du gar nicht erst an dich ran.',
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
      aEl.innerHTML = a.map(([label], answerIndex) =>
        `<label class="answer"><input type="radio" name="q${i}" value="${answerIndex}" required>${label}</label>`
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
      const scores = Object.fromEntries(Object.keys(RESULTS).map(product => [product, 0]));
      picks.forEach((answerIndex, questionIndex) => {
        QUESTIONS[questionIndex].a[answerIndex][1].forEach(product => { scores[product] += 1; });
      });
      const product = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
      step.hidden = true;
      result.hidden = false;
      const resultText = RESULTS[product];
      const headlineEnd = resultText.indexOf('!') + 1;
      const headline = document.createElement('strong');
      headline.textContent = resultText.slice(0, headlineEnd);
      result.replaceChildren(headline, document.createTextNode(resultText.slice(headlineEnd)));
      next.textContent = 'Nochmals';
      next.disabled = false;
    });
    render();
  }

  /* ---------- Nach oben ---------- */
    (() => {
      const section = document.querySelector('.kontakt');
      const envelope = document.querySelector('[data-env]');
      if (!section || !envelope) return;

      document.documentElement.classList.add('js');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const flap = envelope.querySelector('.env__flap');
      const letter = envelope.querySelector('.env__letter');
      const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
      const range = (progress, start, end) => clamp((progress - start) / (end - start));
      const ease = value => value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2;
      let ticking = false;

      function updateEnvelope() {
        ticking = false;
        const bounds = section.getBoundingClientRect();
        const progress = clamp(-bounds.top / (bounds.height - window.innerHeight));
        const flapProgress = ease(range(progress, 0.05, 0.3));
        const riseProgress = ease(range(progress, 0.28, 0.58));
        const formProgress = ease(range(progress, 0.56, 0.78));
        const dropProgress = ease(range(progress, 0.55, 0.85));
        section.style.setProperty('--flap', flapProgress.toFixed(4));
        section.style.setProperty('--rise', riseProgress.toFixed(4));
        section.style.setProperty('--form', formProgress.toFixed(4));
        section.style.setProperty('--drop', dropProgress.toFixed(4));
        flap.dataset.side = flapProgress > 0.5 ? 'back' : 'front';
        if (formProgress > 0.85) letter.removeAttribute('inert');
        else letter.setAttribute('inert', '');
      }

      function scheduleUpdate() {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateEnvelope);
        }
      }

      window.addEventListener('scroll', scheduleUpdate, { passive: true });
      window.addEventListener('resize', scheduleUpdate);
      updateEnvelope();
    })();

    /* ---------- Nach oben ---------- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    const onScroll = () => toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
