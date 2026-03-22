// Glass Effects & 3D Tilt

export function initGlassEffects() {
    initSpotlight();
    initTilt();
    initMobileScrollEffects();
    initScrollReveal();
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
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) translateY(-5px) scale3d(1.02, 1.02, 1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset to default smoothly
            card.style.transform = `perspective(1000px) translateY(0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            
            // Allow the CSS animation to take back over after the smooth hover reset transition finishes.
            setTimeout(() => { 
                if (!card.matches(':hover')) {
                    card.style.transform = ''; 
                }
            }, 500);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // remove transition for smooth tracking
        });
    });
}

function initMobileScrollEffects() {
    // Only run this logic on devices without fine pointer control (mobile/tablets)
    if (!window.matchMedia("(hover: none)").matches) return;

    const cards = document.querySelectorAll('.tilt-card');

    // We observe when cards are moving through the viewport
    const viewportHeight = window.innerHeight;

    const onScroll = () => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();

            // Only calculate if the card is actually on screen
            if (rect.top <= viewportHeight && rect.bottom >= 0) {
                // Calculate how close the center of the card is to the center of the viewport
                const cardCenterY = rect.top + (rect.height / 2);
                const viewportCenterY = viewportHeight / 2;

                // Value from -1 (top of screen) to 1 (bottom of screen)
                // 0 is perfectly centered
                const distanceRatio = (cardCenterY - viewportCenterY) / viewportCenterY;

                // If it's near the center (ratio between -0.4 and 0.4), apply a slight pop and tilt
                if (Math.abs(distanceRatio) < 0.6) {
                    const rotateX = distanceRatio * -15; // Max 15 deg tilt
                    // Add a slight static Y rotation just to show off the 3d
                    const rotateY = distanceRatio * 5;

                    // Add a faux spotlight by moving variables
                    card.style.setProperty('--mouse-x', `${rect.width / 2}px`);
                    card.style.setProperty('--mouse-y', `${rect.height / 2}px`);

                    // Ensure the spotlight is visible by adding a class or inline style that forces the opacity
                    card.classList.add('mobile-active-tilt');

                    card.style.transform = `perspective(1000px) translateY(-5px) scale3d(1.02, 1.02, 1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    card.style.transition = 'transform 0.1s ease-out';
                    card.style.boxShadow = '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)';
                    card.style.zIndex = '10';
                } else {
                    // Reset when scrolling away from center
                    card.classList.remove('mobile-active-tilt');
                    card.style.transform = `perspective(1000px) translateY(0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`;
                    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
                    card.style.boxShadow = '';
                    card.style.zIndex = '';
                }
            }
        });
    };

    // Attach to scroll and touch events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Run once on load to catch cards already in view
    onScroll();
}

function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('reveal-visible');
                // Stop observing once revealed (optional, remove if you want elements to hide/reveal constantly)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Find all elements looking to be revealed
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));
}
