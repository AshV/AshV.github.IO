// Theme and Ambient Management

const ALL_THEMES = [
    // Time-of-day originals
    'theme-midnight',
    'theme-predawn',
    'theme-sunrise',
    'theme-morning',
    'theme-noon',
    'theme-golden',
    'theme-dusk',
    'theme-late-night',
    // New themes
    'theme-forest',
    'theme-ocean',
    'theme-volcanic',
    'theme-arctic',
    'theme-sakura',
    'theme-cyberpunk',
];

export function initTheme() {
    applyTheme();
    initAmbientBackground();
}

function applyTheme() {
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

    // Pick a random theme on every page load
    // Avoid repeating the same theme back-to-back
    const last = sessionStorage.getItem('last-theme');
    let pool = ALL_THEMES.filter(t => t !== last);
    if (pool.length === 0) pool = ALL_THEMES; // safety fallback

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    sessionStorage.setItem('last-theme', chosen);
    body.classList.add(chosen);
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
