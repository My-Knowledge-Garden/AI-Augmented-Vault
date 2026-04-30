/**
 * Search Component
 * Handles real-time full-text search across documentation
 */

let searchIndex = [];
let searchInput = null;
let searchResults = null;

/**
 * Initialize search functionality
 */
async function initializeSearch() {
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    try {
        // Load search index
        const response = await fetch('/search-index.json');
        if (!response.ok) throw new Error('Failed to load search index');
        
        searchIndex = await response.json();
        
        // Attach event listeners
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('focus', showSearchResults);
        document.addEventListener('click', handleDocumentClick);
        searchInput.addEventListener('keydown', handleSearchKeydown);
        
    } catch (err) {
        console.error('Error initializing search:', err);
    }
}

/**
 * Handle search input
 * @param {Event} e - Input event
 */
function handleSearchInput(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 1) {
        searchResults.innerHTML = '';
        searchResults.classList.add('hidden');
        return;
    }
    
    const results = performSearch(query);
    displaySearchResults(results);
}

/**
 * Perform full-text search
 * @param {string} query - Search query
 * @returns {array} - Search results
 */
function performSearch(query) {
    const queryTerms = query.split(/\s+/).filter(t => t.length > 0);
    
    return searchIndex
        .map(item => {
            // Calculate relevance score
            let score = 0;
            let titleMatches = 0;
            let descMatches = 0;
            let contentMatches = 0;
            
            const title = (item.title || '').toLowerCase();
            const description = (item.description || '').toLowerCase();
            const content = (item.content || '').toLowerCase();
            const keywords = (item.keywords || []).map(k => k.toLowerCase()).join(' ');
            
            for (const term of queryTerms) {
                // Title matches are most important
                if (title.includes(term)) {
                    titleMatches += 10;
                    // Bonus for word boundary matches
                    if (new RegExp(`\\b${term}\\b`).test(title)) {
                        titleMatches += 5;
                    }
                }
                
                // Description matches
                if (description.includes(term)) {
                    descMatches += 5;
                }
                
                // Content matches
                if (content.includes(term)) {
                    contentMatches += 1;
                }
                
                // Keyword matches
                if (keywords.includes(term)) {
                    score += 3;
                }
            }
            
            score += titleMatches + descMatches + contentMatches;
            
            return {
                ...item,
                score
            };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

/**
 * Display search results
 * @param {array} results - Search results
 */
function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        searchResults.classList.remove('hidden');
        return;
    }
    
    const html = results.map(result => `
        <div class="search-result-item" data-url="${result.url}">
            <h3>${highlightTerms(result.title, searchInput.value)}</h3>
            <p>${result.description || result.preview}</p>
            <small>${result.category}</small>
        </div>
    `).join('');
    
    searchResults.innerHTML = html;
    searchResults.classList.remove('hidden');
    
    // Attach click handlers
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });
}

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} - HTML with highlights
 */
function highlightTerms(text, query) {
    if (!query) return escapeHtml(text);
    
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    let highlighted = escapeHtml(text);
    
    for (const term of terms) {
        const regex = new RegExp(`(${term})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    }
    
    return highlighted;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Handle keyboard navigation in search results
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleSearchKeydown(e) {
    if (e.key === 'Escape') {
        searchResults.classList.add('hidden');
        return;
    }
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigateSearchResults(e.key === 'ArrowDown' ? 'down' : 'up');
    }
    
    if (e.key === 'Enter') {
        const items = searchResults.querySelectorAll('.search-result-item');
        const selected = searchResults.querySelector('.search-result-item.selected');
        
        if (selected) {
            const url = selected.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        } else if (items.length > 0) {
            const url = items[0].getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        }
    }
}

/**
 * Navigate search results with keyboard
 * @param {string} direction - 'up' or 'down'
 */
function navigateSearchResults(direction) {
    const items = searchResults.querySelectorAll('.search-result-item');
    const selected = searchResults.querySelector('.search-result-item.selected');
    
    if (items.length === 0) return;
    
    let nextIndex = 0;
    
    if (selected) {
        const currentIndex = Array.from(items).indexOf(selected);
        nextIndex = direction === 'down' 
            ? Math.min(currentIndex + 1, items.length - 1)
            : Math.max(currentIndex - 1, 0);
    }
    
    items.forEach(item => item.classList.remove('selected'));
    items[nextIndex].classList.add('selected');
    items[nextIndex].scrollIntoView({ block: 'nearest' });
}

/**
 * Show search results when input is focused
 */
function showSearchResults() {
    if (searchInput.value.trim().length > 0 && searchResults.innerHTML) {
        searchResults.classList.remove('hidden');
    }
}

/**
 * Handle document click to close search
 * @param {Event} e - Click event
 */
function handleDocumentClick(e) {
    if (!searchInput.closest('.search-container').contains(e.target)) {
        searchResults.classList.add('hidden');
    }
}

// Add styles for search result highlighting
const style = document.createElement('style');
style.textContent = `
    mark {
        background-color: oklch(40% 0.08 60);
        color: inherit;
        padding: 0.1em 0.2em;
        border-radius: 2px;
    }
    
    .search-no-results {
        padding: 1rem;
        text-align: center;
        color: oklch(60% 0.01 250);
        font-size: 0.9rem;
    }
    
    .search-result-item.selected {
        background-color: oklch(30% 0.015 240);
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Initialize on document ready
document.addEventListener('DOMContentLoaded', initializeSearch);
