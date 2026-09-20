import { initTheme } from './theme.js';
import { initGlassEffects } from './glassEffects.js';
import { initSearch } from './search.js';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {

    // 1. Setup Theme & Environment
    initTheme();

    // 2. Initialize Interactive Effects
    initGlassEffects();

    // 3. Initialize Search
    initSearch();

    // 4. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

