// ===== Header scroll state =====
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    })
);

// ===== Reveal on scroll =====
const revealTargets = document.querySelectorAll(
    '.card, .step, .section-head, .pillar, .hub-base, .flow-step, .taggroup, ' +
    '.collab-card, .tool-content, .benefits-content, ' +
    '.benefits-visual, .cta-form, .cta-text'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${(i % 3) * 80}ms`;
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// ===== Projects carousel =====
(() => {
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('projectsPrev');
    const nextBtn = document.getElementById('projectsNext');
    const dotsWrap = document.getElementById('projectsDots');
    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const cards = Array.from(track.children);
    if (!cards.length) return;

    let step = 0, perView = 1, pages = 1;

    const measure = () => {
        const s = getComputedStyle(track);
        const gap = parseFloat(s.columnGap) || 0;
        const inner = track.clientWidth - (parseFloat(s.paddingLeft) || 0) - (parseFloat(s.paddingRight) || 0);
        step = cards[0].getBoundingClientRect().width + gap;
        perView = step > 0 ? Math.max(1, Math.round((inner + gap) / step)) : 1;
        pages = Math.max(1, Math.ceil(cards.length / perView));
    };

    const buildDots = () => {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'dot';
            dot.setAttribute('aria-label', `Grupo ${i + 1} de ${pages}`);
            dot.addEventListener('click', () => {
                track.scrollTo({ left: i * step * perView, behavior: 'smooth' });
            });
            dotsWrap.appendChild(dot);
        }
    };

    const sync = () => {
        const max = track.scrollWidth - track.clientWidth;
        const span = step * perView;
        const active = span > 0 ? Math.min(Math.round(track.scrollLeft / span), pages - 1) : 0;
        Array.from(dotsWrap.children).forEach((dot, i) => {
            if (i === active) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
        prevBtn.disabled = track.scrollLeft <= 2;
        nextBtn.disabled = track.scrollLeft >= max - 2;
    };

    const turn = (dir) => track.scrollBy({ left: dir * step * perView, behavior: 'smooth' });
    prevBtn.addEventListener('click', () => turn(-1));
    nextBtn.addEventListener('click', () => turn(1));

    let raf;
    track.addEventListener('scroll', () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(sync);
    }, { passive: true });

    const refresh = () => { measure(); buildDots(); sync(); };
    refresh();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refresh, 150);
    });
})();

// ===== Contact form (demo handler) =====
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk) {
        note.textContent = 'Por favor, completa tu nombre y un email válido.';
        note.className = 'form-note err';
        return;
    }
    note.textContent = '¡Gracias! Hemos recibido tu solicitud. Te contactaremos muy pronto.';
    note.className = 'form-note ok';
    form.reset();
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();
