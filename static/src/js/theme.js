// Theme and Ambient Management

export function initTheme() {
    updateThemeBasedOnTime();
    initAmbientBackground();

    // Update theme every hour
    setInterval(updateThemeBasedOnTime, 1000 * 60 * 60);
}

function updateThemeBasedOnTime() {
    const hour = new Date().getHours();
    const body = document.body;

    // Remove all theme classes first
    body.classList.remove('theme-morning', 'theme-afternoon', 'theme-evening');

    if (hour >= 5 && hour < 12) {
        body.classList.add('theme-morning');
    } else if (hour >= 12 && hour < 17) {
        body.classList.add('theme-afternoon');
    } else if (hour >= 17 && hour < 21) {
        body.classList.add('theme-evening');
    } else {
        // Night is the default theme, no specific class needed as it uses the default CSS variables
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
