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
  const parallaxBubbles = [...document.querySelectorAll('.kneten__bubble, .story-step__bubble')];
  const parallaxTitles = [...document.querySelectorAll('[data-title-parallax-range]')];
  const wegParallaxElements = [...document.querySelectorAll('.weg .story-layout__media, .weg .story-layout__text')];
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
        const currentOffset = Number.parseFloat(ingredient.style.getPropertyValue('--story-step-parallax-y')) || 0;
        const centerDistance = bounds.top + bounds.height / 2 - currentOffset - window.innerHeight / 2;
        const offset = reducedMotion.matches ? 0 : Math.max(-range, Math.min(range, -centerDistance * 0.08));
        ingredient.style.setProperty('--story-step-parallax-y', `${offset}px`);
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

  /* ---------- Scroll-Ablauf (Stories + Quiz) ----------
     Bereiche mit [data-pin]: Der Titel bleibt stehen, der Inhalt scrollt bis zur
     Bildschirmmitte, bleibt kurz stehen und scrollt danach zusammen mit dem Titel weg.
     data-pin-pause        Länge des Stopps als Anteil der Bildschirmhöhe
     data-pin-mode="middle" Titel und Inhalt stoppen gemeinsam: Titel knapp über der Mitte,
                           Inhalt beginnt in der Mitte. Der Hintergrund scrollt derweil weiter.
     data-pin-media        nur aktiv, wenn diese Media-Query zutrifft */
  const pinAreas = [...document.querySelectorAll('[data-pin]')].map(area => ({
    area,
    head: area.querySelector('[data-pin-head]'),
    title: area.querySelector('[data-pin-title]'),
    content: area.querySelector('[data-pin-content]'),
    pause: Number.parseFloat(area.dataset.pinPause) || 0.3,
    middle: area.dataset.pinMode === 'middle',
    media: area.dataset.pinMedia ? window.matchMedia(area.dataset.pinMedia) : null,
  })).filter(pin => pin.head && pin.title && pin.content);
  const pinHolds = [...document.querySelectorAll('[data-pin-hold]')].map(area => {
    const item = area.querySelector('[data-pin-hold-item]');
    return {
      area,
      item,
      title: item?.querySelector('.story-step__title'),
      bubble: item?.querySelector('.story-step__bubble'),
      pause: Number.parseFloat(area.dataset.pinPause) || 0.2,
      media: area.dataset.pinMedia ? window.matchMedia(area.dataset.pinMedia) : null,
    };
  }).filter(hold => hold.item && hold.title);
  if (pinAreas.length || pinHolds.length) {
    const storyTabs = document.querySelector('.weg .tabs');
    const pinVars = ['--pin-pause', '--pin-title-top', '--pin-content-top', '--pin-head-h', '--pin-head-mb'];
    let storyTitleTop = 0;
    const layoutPin = ({ area, head, title, content, pause, middle, media }) => {
      if (media && !media.matches) {
        pinVars.forEach(name => area.style.removeProperty(name));
        return;
      }
      const vh = window.innerHeight;
      const titleHeight = title.offsetHeight;
      const contentHeight = content.offsetHeight;
      let titleTop;
      let contentTop;
      if (middle) {
        // Titel knapp über der Mitte (aber unter der Tab-Leiste), Inhalt direkt darunter ab der Mitte.
        const gap = Math.max(32, Math.round(window.innerWidth * 48 / 1728));
        titleTop = Math.max(storyTitleTop, Math.round(vh / 2 - gap - titleHeight));
        contentTop = titleTop + titleHeight + gap;
        area.style.setProperty('--pin-title-top', `${titleTop}px`);
      } else {
        // Inhalt mittig; ist er zu hoch, stoppt er, sobald sein unteres Ende sichtbar ist.
        titleTop = Number.parseFloat(getComputedStyle(title).top) || 0;
        contentTop = contentHeight > vh - 32 ? vh - contentHeight - 16 : (vh - contentHeight) / 2;
      }
      area.style.setProperty('--pin-pause', `${Math.round(vh * pause)}px`);
      area.style.setProperty('--pin-content-top', `${contentTop}px`);
      // Titel-Bereich so lang machen, dass Titel und Inhalt im selben Moment losgelassen werden.
      const areaStyle = getComputedStyle(area);
      const paddingTop = Number.parseFloat(areaStyle.paddingTop) || 0;
      const innerHeight = area.clientHeight - paddingTop - (Number.parseFloat(areaStyle.paddingBottom) || 0);
      const headTop = head.offsetTop - paddingTop;
      const headHeight = Math.max(titleHeight, titleTop + titleHeight - headTop - (contentTop + contentHeight - innerHeight));
      area.style.setProperty('--pin-head-h', `${headHeight}px`);
      area.style.setProperty('--pin-head-mb', `${titleHeight - headHeight}px`);
    };
    /* Bereiche mit [data-pin-hold]: Titel und Sprechblase stoppen gemeinsam in der Bildschirmmitte
       (Länge über data-pin-pause) und scrollen danach weiter. */
    const layoutHold = ({ area, item, title, bubble, pause, media }) => {
      if (media && !media.matches) {
        ['--pin-pause', '--pin-hold-top'].forEach(name => area.style.removeProperty(name));
        return;
      }
      const vh = window.innerHeight;
      // Sichtbarer Teil = Titel (ohne seinen Innenabstand unten) und Sprechblase, ohne Leerraum darüber.
      const titleTop = title.parentElement.offsetTop + title.offsetTop;
      const titleBottom = titleTop + title.offsetHeight - (Number.parseFloat(getComputedStyle(title).paddingBottom) || 0);
      const visibleTop = bubble ? Math.min(titleTop, bubble.offsetTop) : titleTop;
      const visibleBottom = bubble ? Math.max(titleBottom, bubble.offsetTop + bubble.offsetHeight) : titleBottom;
      const holdTop = Math.max(storyTitleTop - titleTop, Math.round((vh - (visibleBottom - visibleTop)) / 2 - visibleTop));
      area.style.setProperty('--pin-hold-top', `${holdTop}px`);
      area.style.setProperty('--pin-pause', `${Math.round(vh * pause)}px`);
    };
    /* Weiches Stoppen und Anfahren: Ohne Hilfe stoppt ein "sticky"-Element schlagartig.
       Hier wird es kurz vor dem Stopp abgebremst und danach sanft wieder beschleunigt
       (zusätzliche Verschiebung über die CSS-Variable --pin-ease-y). */
    const EASE = 0.3; // Länge der Brems-/Anfahrstrecke als Anteil der Bildschirmhöhe
    let easeGroups = [];
    const smoothClamp = (a, max, r) => {
      const h = r / 2;
      if (a <= -h) return 0;
      if (a < h) return (a + h) ** 2 / (2 * r);
      if (a <= max - h) return a;
      if (a < max + h) return max - (max + h - a) ** 2 / (2 * r);
      return max;
    };
    const measureEase = el => {
      const box = el.parentElement.closest('[data-pin-head], [data-pin], [data-pin-hold]');
      const boxStyle = getComputedStyle(box);
      const paddingTop = Number.parseFloat(boxStyle.paddingTop) || 0;
      const inner = box.clientHeight - paddingTop - (Number.parseFloat(boxStyle.paddingBottom) || 0);
      // Natürliche Position (ohne "sticky") messen.
      el.style.position = 'static';
      const naturalTop = el.offsetTop - paddingTop;
      el.style.position = '';
      const stickyTop = Number.parseFloat(getComputedStyle(el).top) || 0;
      return { el, box, paddingTop, naturalTop, stickyTop, hold: Math.max(0, inner - el.offsetHeight - naturalTop) };
    };
    const measureEaseGroups = () => {
      easeGroups.forEach(group => group.items.forEach(({ el }) => el.style.removeProperty('--pin-ease-y')));
      const vh = window.innerHeight;
      const groups = [
        ...pinAreas.filter(pin => !pin.media || pin.media.matches).map(pin => ({ elements: [pin.title, pin.content], area: pin.area })),
        ...pinHolds.filter(hold => !hold.media || hold.media.matches).map(hold => ({ elements: [hold.item], area: hold.area })),
      ];
      easeGroups = groups.map(({ elements, area }) => {
        const items = elements.map(measureEase);
        // [data-pin-follow] (z.B. Quiz-Hintergrund) bewegt sich exakt mit dem Inhalt mit.
        const followers = [...area.querySelectorAll('[data-pin-follow]')];
        // Gleiche Strecke für alle Elemente eines Bereichs, damit sie zusammen losfahren.
        const r = Math.min(vh * EASE, 0.8 * Math.min(...items.map(item => item.hold)));
        return { items, r, followers };
      });
    };
    const updateEase = () => {
      easeGroups.forEach(({ items, r, followers }) => items.forEach((item, index) => {
        const boxTop = item.box.getBoundingClientRect().top + item.paddingTop;
        const a = item.stickyTop - (boxTop + item.naturalTop);
        const moved = r > 0 ? smoothClamp(a, item.hold, r) : Math.max(0, Math.min(a, item.hold));
        const offset = moved - Math.max(0, Math.min(a, item.hold));
        item.el.style.setProperty('--pin-ease-y', `${offset.toFixed(2)}px`);
        if (index === items.length - 1) followers.forEach(el => el.style.setProperty('--pin-follow-y', `${moved.toFixed(2)}px`));
      }));
    };
    let easePending = false;
    window.addEventListener('scroll', () => {
      if (easePending) return;
      easePending = true;
      requestAnimationFrame(() => { easePending = false; updateEase(); });
    }, { passive: true });

    const layoutPins = () => {
      // Story-Titel bleiben knapp unter der Tab-Leiste stehen.
      if (storyTabs) {
        const tabsBottom = (Number.parseFloat(getComputedStyle(storyTabs).top) || 0) + storyTabs.offsetHeight;
        storyTitleTop = Math.round(tabsBottom + 24);
        document.documentElement.style.setProperty('--story-title-top', `${storyTitleTop}px`);
      }
      pinAreas.forEach(layoutPin);
      pinHolds.forEach(layoutHold);
      measureEaseGroups();
      updateEase();
    };
    let pinLayoutPending = false;
    const schedulePinLayout = () => {
      if (pinLayoutPending) return;
      pinLayoutPending = true;
      requestAnimationFrame(() => { pinLayoutPending = false; layoutPins(); });
    };
    window.addEventListener('resize', schedulePinLayout);
    window.addEventListener('load', schedulePinLayout);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(schedulePinLayout);
      pinAreas.forEach(({ title, content }) => { observer.observe(title); observer.observe(content); });
      pinHolds.forEach(({ item }) => observer.observe(item));
    }
    document.fonts?.ready.then(schedulePinLayout);
    layoutPins();
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

      // Scrollstrecke, bevor der Umschlag auftaucht (muss zu --env-delay in styles.css passen)
      const ENV_DELAY = 700;
      const flap = envelope.querySelector('.env__flap');
      const letter = envelope.querySelector('.env__letter');
      const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
      const range = (progress, start, end) => clamp((progress - start) / (end - start));
      const ease = value => value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2;
      let ticking = false;

      function updateEnvelope() {
        ticking = false;
        const bounds = section.getBoundingClientRect();
        const scrollDistance = bounds.height - window.innerHeight;
        const originalScrollDistance = Math.max(1, scrollDistance - ENV_DELAY);
        const progress = clamp(-bounds.top / scrollDistance);
        const originalProgress = clamp(-bounds.top / originalScrollDistance);
        const delayProgress = ENV_DELAY / scrollDistance;
        const envelopeProgress = clamp((progress - delayProgress) / (1 - delayProgress));
        const flapProgress = ease(range(envelopeProgress, 0.05, 0.3));
        const riseProgress = ease(range(envelopeProgress, 0.28, 0.58));
        const formProgress = ease(range(envelopeProgress, 0.56, 0.78));
        const dropProgress = ease(range(originalProgress, 0.55, 0.85));
        const envelopeDropProgress = ease(range(envelopeProgress, 0.55, 0.85));
        const envelopeOffset = ENV_DELAY * (1 - ease(range(progress, 0, delayProgress)));
        section.style.setProperty('--flap', flapProgress.toFixed(4));
        section.style.setProperty('--rise', riseProgress.toFixed(4));
        section.style.setProperty('--form', formProgress.toFixed(4));
        section.style.setProperty('--drop', dropProgress.toFixed(4));
        section.style.setProperty('--env-drop', envelopeDropProgress.toFixed(4));
        section.style.setProperty('--env-offset', `${envelopeOffset.toFixed(2)}px`);
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
