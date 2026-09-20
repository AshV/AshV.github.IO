/**
 * Search Controller for Portfolio Cards Grid
 * Supports instant filtering by title, excerpt, tags, and keywords
 * with keyboard shortcuts (Ctrl+K / Cmd+K / Slash / Escape)
 */

export function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
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

    // 2. Filter Function
    function performSearch() {
        const rawQuery = searchInput.value.trim().toLowerCase();
        const queryTokens = rawQuery.split(/\s+/).filter(Boolean);

        if (queryTokens.length === 0) {
            // Show all cards
            cards.forEach(card => {
                card.classList.remove('hidden');
                card.style.display = 'flex';
            });

            if (searchClearBtn) searchClearBtn.classList.add('hidden');
            if (emptyState) emptyState.classList.add('hidden');
            if (searchCountBadge) {
                searchCountBadge.textContent = `${totalCount} tools`;
            }
            return;
        }

        // Show clear button
        if (searchClearBtn) searchClearBtn.classList.remove('hidden');

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

    // 3. Clear Search
    function clearSearch() {
        searchInput.value = '';
        performSearch();
        searchInput.focus();
    }

    // 4. Event Listeners
    searchInput.addEventListener('input', performSearch);

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', clearSearch);
    }

    if (emptyStateResetBtn) {
        emptyStateResetBtn.addEventListener('click', clearSearch);
    }

    // 5. Global Keyboard Shortcuts: Ctrl+K, Cmd+K, '/', Escape
    document.addEventListener('keydown', (e) => {
        // Don't intercept if user is typing in another input or textarea
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isEditable = activeTag === 'input' || activeTag === 'textarea' || document.activeElement.isContentEditable;

        // Focus search: Ctrl+K, Cmd+K, or Slash (when not in an input)
        if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isEditable)) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
            return;
        }

        // Clear search / Blur: Escape
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            if (searchInput.value) {
                clearSearch();
            } else {
                searchInput.blur();
            }
        }
    });

    // Initial count display
    if (searchCountBadge) {
        searchCountBadge.textContent = `${totalCount} tools`;
    }
}
