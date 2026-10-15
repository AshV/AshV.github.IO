// Glass Effects & 3D Tilt

export function initGlassEffects() {
    initSpotlight();
    initTilt();
    initMobileScrollEffects();
    initScrollReveal();
    initReadingProgress();
    initHeroParallax();
    initBlobParallax();
}

function initSpotlight() {
    // Add spotlight to all glass panels
    document.addEventListener('mousemove', (e) => {
        const spotlights = document.querySelectorAll('.glass-spotlight');
        spotlights.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function initTilt() {
    const MAX_ROTATE = 18; // ±18° — dramatic, iOS-springboard feel
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Disable CSS animation so JS takes full control
            card.style.animation  = 'none';
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width  / 2;
            const centerY = rect.height / 2;

            // Normalised -1 … +1
            const nx = (x - centerX) / centerX;
            const ny = (y - centerY) / centerY;

            const rotateX = ny * -MAX_ROTATE;
            const rotateY = nx *  MAX_ROTATE;

            // Drive the directional shadow CSS vars
            card.style.setProperty('--tilt-x', rotateX.toFixed(2));
            card.style.setProperty('--tilt-y', rotateY.toFixed(2));

            card.style.transform =
                `perspective(1200px) translateY(-8px) scale3d(1.04, 1.04, 1.04) ` +
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Smooth reset
            card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.6s ease';
            card.style.transform  = 'perspective(1200px) translateY(0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)';
            card.style.setProperty('--tilt-x', '0');
            card.style.setProperty('--tilt-y', '0');

            // Hand back to CSS animation after reset settles
            setTimeout(() => {
                if (!card.matches(':hover')) {
                    card.style.transform  = '';
                    card.style.transition = '';
                    card.style.animation  = '';
                }
            }, 650);
        });
    });
}

function initMobileScrollEffects() {
    if (!window.matchMedia('(hover: none)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    const viewportHeight = window.innerHeight;

    const onScroll = () => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top <= viewportHeight && rect.bottom >= 0) {
                const cardCenterY     = rect.top + (rect.height / 2);
                const viewportCenterY = viewportHeight / 2;
                const distanceRatio   = (cardCenterY - viewportCenterY) / viewportCenterY;

                if (Math.abs(distanceRatio) < 0.6) {
                    const rotateX = distanceRatio * -18;
                    const rotateY = distanceRatio *   6;

                    card.style.setProperty('--mouse-x', `${rect.width  / 2}px`);
                    card.style.setProperty('--mouse-y', `${rect.height / 2}px`);
                    card.classList.add('mobile-active-tilt');

                    card.style.transform  = `perspective(1200px) translateY(-8px) scale3d(1.04, 1.04, 1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    card.style.transition = 'transform 0.1s ease-out';
                    card.style.boxShadow  = '0 20px 40px rgba(0,0,0,0.35), 0 10px 20px rgba(0,0,0,0.25)';
                    card.style.zIndex     = '10';
                } else {
                    card.classList.remove('mobile-active-tilt');
                    card.style.transform  = `perspective(1200px) translateY(0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`;
                    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
                    card.style.boxShadow  = '';
                    card.style.zIndex     = '';
                }
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            progressBar.style.width = ((winScroll / height) * 100) + '%';
        }
    }, { passive: true });
}

// ── Hero scroll parallax ──────────────────────────────────────────────────────
function initHeroParallax() {
    const hero = document.getElementById('hero-section');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrollY   = window.scrollY;
        const maxScroll = 300; // px of scroll that maps to full tilt range
        const maxTilt   = 6;   // degrees
        const tilt = Math.min(scrollY / maxScroll * maxTilt, maxTilt);
        hero.style.setProperty('--hero-rx', `${tilt}deg`);
    }, { passive: true });
}

// ── Blob mouse parallax ───────────────────────────────────────────────────────
function initBlobParallax() {
    const blobs = document.querySelectorAll('.ambient-blob');
    if (!blobs.length) return;

    // Different depth multipliers per blob (fraction of viewport offset)
    const depths = [0.025, -0.018, 0.012];

    let ticking = false;
    document.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const cx = window.innerWidth  / 2;
            const cy = window.innerHeight / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;

            blobs.forEach((blob, i) => {
                const d  = depths[i] ?? 0.01;
                const tx = (dx * d).toFixed(1);
                const ty = (dy * d).toFixed(1);
                blob.style.setProperty('--blob-tx', `${tx}px`);
                blob.style.setProperty('--blob-ty', `${ty}px`);
            });

            ticking = false;
        });
    }, { passive: true });
}
