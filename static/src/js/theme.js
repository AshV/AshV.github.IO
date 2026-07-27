// Theme and Ambient Management

const ALL_THEMES = [
    'theme-midnight',
    'theme-predawn',
    'theme-sunrise',
    'theme-morning',
    'theme-noon',
    'theme-golden',
    'theme-dusk',
    'theme-late-night',
];

export function initTheme() {
    updateThemeBasedOnTime();
    initAmbientBackground();

    // Update theme every hour
    setInterval(updateThemeBasedOnTime, 1000 * 60 * 60);
}

function updateThemeBasedOnTime() {
    const body = document.body;

    // Remove all theme classes first
    body.classList.remove(...ALL_THEMES);

    // --- Query-string override: ?theme=dusk ---
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('theme');
    if (requested && ALL_THEMES.includes('theme-' + requested)) {
        body.classList.add('theme-' + requested);
        return;
    }

    // Fall back to time-based selection
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 3) {
        body.classList.add('theme-midnight');     // 00:00 – 02:59  Deep night
    } else if (hour >= 3 && hour < 6) {
        body.classList.add('theme-predawn');      // 03:00 – 05:59  Pre-dawn
    } else if (hour >= 6 && hour < 9) {
        body.classList.add('theme-sunrise');      // 06:00 – 08:59  Sunrise
    } else if (hour >= 9 && hour < 12) {
        body.classList.add('theme-morning');      // 09:00 – 11:59  Morning
    } else if (hour >= 12 && hour < 15) {
        body.classList.add('theme-noon');         // 12:00 – 14:59  Noon
    } else if (hour >= 15 && hour < 18) {
        body.classList.add('theme-golden');       // 15:00 – 17:59  Golden Hour
    } else if (hour >= 18 && hour < 21) {
        body.classList.add('theme-dusk');         // 18:00 – 20:59  Dusk
    } else {
        body.classList.add('theme-late-night');   // 21:00 – 23:59  Late Night
    }
}

function initAmbientBackground() {
    const container = document.getElementById('ambient-background');
    if (!container) return;

    // Create 3 blobs for ambient background
    for (let i = 0; i < 3; i++) {
        const blob = document.createElement('div');
        blob.className = 'ambient-blob';
        container.appendChild(blob);
    }
}
