/**
 * Search Controller for Portfolio Cards Grid
 * Supports instant filtering by title, excerpt, tags, and keywords
 * with keyboard shortcuts (Ctrl+K / Cmd+K / Slash / Escape)
 */

export function initSearch() {
    const searchWrapper = document.getElementById('header-search-wrapper');
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchBox = document.getElementById('header-search-box');
    const searchInput = document.getElementById('search-input');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchCountBadge = document.getElementById('search-count-badge');
    const searchShortcutBadge = document.getElementById('search-shortcut-badge');
    const emptyState = document.getElementById('search-empty-state');
    const emptyStateQuery = document.getElementById('search-empty-query');
    const emptyStateResetBtn = document.getElementById('search-empty-reset-btn');
    const cards = Array.from(document.querySelectorAll('.tilt-card[data-title]'));

    if (!searchInput || cards.length === 0) return;

    const totalCount = cards.length;

    // 1. Detect Platform for Shortcut Badge (⌘K vs Ctrl+K)
    if (searchShortcutBadge) {
        const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
        searchShortcutBadge.textContent = isMac ? '⌘K' : 'Ctrl+K';
    }

    // 2. Open & Close Search Bar Helpers
    function openSearch() {
        if (!searchBox) return;
        searchBox.classList.remove('hidden');
        searchBox.classList.add('flex');
        if (searchToggleBtn) searchToggleBtn.classList.add('hidden');
        setTimeout(() => {
            searchInput.focus();
            searchInput.select();
        }, 50);
    }

    function closeSearch() {
        if (!searchBox) return;
        if (searchInput.value) {
            searchInput.value = '';
            performSearch();
        }
        searchBox.classList.add('hidden');
        searchBox.classList.remove('flex');
        if (searchToggleBtn) {
            searchToggleBtn.classList.remove('hidden');
            searchToggleBtn.focus();
        }
    }

    // 3. Filter Function
    function performSearch() {
        const rawQuery = searchInput.value.trim().toLowerCase();
        const queryTokens = rawQuery.split(/\s+/).filter(Boolean);

        if (queryTokens.length === 0) {
            // Show all cards
            cards.forEach(card => {
                card.classList.remove('hidden');
                card.style.display = 'flex';
            });

            if (emptyState) emptyState.classList.add('hidden');
            if (searchCountBadge) {
                searchCountBadge.textContent = `${totalCount} tools`;
            }
            if (searchCloseBtn) {
                searchCloseBtn.title = 'Close (Esc)';
                searchCloseBtn.setAttribute('aria-label', 'Close search bar');
            }
            return;
        }

        if (searchCloseBtn) {
            searchCloseBtn.title = 'Clear search';
            searchCloseBtn.setAttribute('aria-label', 'Clear search');
        }

        let matchCount = 0;

        cards.forEach(card => {
            const title = (card.dataset.title || '').toLowerCase();
            const excerpt = (card.dataset.excerpt || '').toLowerCase();
            const tags = (card.dataset.tags || '').toLowerCase();
            const keywords = (card.dataset.keywords || '').toLowerCase();

            const haystack = `${title} ${excerpt} ${tags} ${keywords}`;

            // Check if every token matches the haystack
            const isMatch = queryTokens.every(token => haystack.includes(token));

            if (isMatch) {
                card.classList.remove('hidden');
                card.style.display = 'flex';
                matchCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Update count badge
        if (searchCountBadge) {
            searchCountBadge.textContent = `${matchCount} of ${totalCount}`;
        }

        // Handle empty state
        if (emptyState) {
            if (matchCount === 0) {
                emptyState.classList.remove('hidden');
                if (emptyStateQuery) emptyStateQuery.textContent = searchInput.value;
            } else {
                emptyState.classList.add('hidden');
            }
        }
    }

    // 4. Clear Search
    function clearSearch() {
        searchInput.value = '';
        performSearch();
        searchInput.focus();
    }

    // 5. Event Listeners
    searchInput.addEventListener('input', performSearch);

    if (searchToggleBtn) {
        searchToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openSearch();
        });
    }

    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (searchInput.value) {
                clearSearch();
            } else {
                closeSearch();
            }
        });
    }

    if (emptyStateResetBtn) {
        emptyStateResetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearSearch();
        });
    }

    // Close on click outside if search input is empty
    document.addEventListener('click', (e) => {
        if (!searchWrapper || !searchBox || searchBox.classList.contains('hidden')) return;
        if (!searchWrapper.contains(e.target)) {
            if (!searchInput.value.trim()) {
                searchBox.classList.add('hidden');
                searchBox.classList.remove('flex');
                if (searchToggleBtn) searchToggleBtn.classList.remove('hidden');
            }
        }
    });

    // 6. Global Keyboard Shortcuts: Ctrl+K, Cmd+K, '/', Escape
    document.addEventListener('keydown', (e) => {
        // Don't intercept if user is typing in another input or textarea
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isEditable = activeTag === 'textarea' || (activeTag === 'input' && document.activeElement !== searchInput) || document.activeElement.isContentEditable;

        // Focus / Open search: Ctrl+K, Cmd+K, or Slash (when not in an input)
        if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isEditable)) {
            e.preventDefault();
            openSearch();
            return;
        }

        // Clear search / Blur / Close: Escape
        if (e.key === 'Escape' && searchBox && !searchBox.classList.contains('hidden')) {
            if (searchInput.value) {
                clearSearch();
            } else {
                closeSearch();
            }
        }
    });

    // Initial count display
    if (searchCountBadge) {
        searchCountBadge.textContent = `${totalCount} tools`;
    }
}
