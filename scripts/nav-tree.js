/**
 * Navigation Tree Component
 * Handles interactive tree navigation in the sidebar
 */

let navTreeData = null;

/**
 * Initialize the navigation tree
 * @param {string} currentPath - Current page path (for highlighting)
 */
async function initializeNavTree(currentPath = '/') {
    try {
        // Load navigation tree data
        const response = await fetch('/nav-tree.json');
        if (!response.ok) throw new Error('Failed to load nav tree');
        
        navTreeData = await response.json();
        
        const navTreeEl = document.getElementById('nav-tree');
        if (!navTreeEl) return;
        
        // Render the tree
        const treeHtml = renderNavTree(navTreeData, currentPath, 0);
        navTreeEl.innerHTML = treeHtml;
        
        // Attach event listeners
        attachTreeListeners();
        
        // Highlight current page
        highlightCurrentPage(currentPath);
        
    } catch (err) {
        console.error('Error initializing nav tree:', err);
        const navTreeEl = document.getElementById('nav-tree');
        if (navTreeEl) {
            navTreeEl.innerHTML = '<div class="nav-error">Unable to load navigation</div>';
        }
    }
}

/**
 * Recursively render navigation tree HTML
 * @param {array} items - Tree items
 * @param {string} currentPath - Current page path
 * @param {number} depth - Current depth for indentation
 * @returns {string} - HTML string
 */
function renderNavTree(items, currentPath, depth = 0) {
    if (!items || items.length === 0) return '';
    
    let html = '<ul class="nav-list">';
    
    for (const item of items) {
        const itemId = `nav-${item.path.replace(/[^a-z0-9]/gi, '_')}`;
        
        if (item.type === 'folder') {
            // Folder item with expand/collapse
            const isExpanded = shouldExpandFolder(item.path, currentPath);
            html += `<li class="nav-item folder" id="${itemId}">`;
            html += `<a class="nav-folder-link" data-path="${item.path}">`;
            html += `<span class="nav-toggle${isExpanded ? ' expanded' : ''}"></span>`;
            html += `<span class="folder-icon">📁</span>`;
            html += `<span class="folder-name">${item.label}</span>`;
            html += `</a>`;
            
            if (item.children && item.children.length > 0) {
                const childrenClass = isExpanded ? 'expanded' : '';
                html += `<ul class="nav-children ${childrenClass}">`;
                html += renderNavTree(item.children, currentPath, depth + 1);
                html += `</ul>`;
            }
            
            html += `</li>`;
        } else if (item.type === 'file') {
            // File item
            const isActive = item.url === currentPath || item.url === currentPath.replace(/\/index\.html$/, '/');
            html += `<li class="nav-item file" id="${itemId}">`;
            html += `<a href="${item.url || '#'}" class="nav-file-link${isActive ? ' active' : ''}">`;
            html += `<span class="file-icon">📄</span>`;
            html += `<span class="file-title">${item.title || item.name}</span>`;
            html += `</a>`;
            html += `</li>`;
        }
    }
    
    html += '</ul>';
    return html;
}

/**
 * Determine if a folder should be expanded based on current path
 * @param {string} folderPath - Folder path
 * @param {string} currentPath - Current page path
 * @returns {boolean} - Should expand
 */
function shouldExpandFolder(folderPath, currentPath) {
    // Always expand if current page is within this folder
    return currentPath.startsWith('/' + folderPath);
}

/**
 * Attach interactive listeners to tree items
 */
function attachTreeListeners() {
    // Folder expansion toggle
    document.querySelectorAll('.nav-folder-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const li = link.closest('.nav-item');
            const childrenUl = li.querySelector('.nav-children');
            
            if (childrenUl) {
                const toggle = link.querySelector('.nav-toggle');
                childrenUl.classList.toggle('expanded');
                toggle.classList.toggle('expanded');
            }
        });
    });
    
    // File link clicks (close mobile sidebar)
    document.querySelectorAll('.nav-file-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileSidebar();
        });
    });
}

/**
 * Highlight the current page in the tree
 * @param {string} currentPath - Current page path
 */
function highlightCurrentPage(currentPath) {
    document.querySelectorAll('.nav-file-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            
            // Open parent folders
            let parent = link.closest('.nav-item').parentElement;
            while (parent) {
                const parentList = parent.closest('.nav-children');
                if (parentList) {
                    parentList.classList.add('expanded');
                    const toggle = parentList.previousElementSibling.querySelector('.nav-toggle');
                    if (toggle) toggle.classList.add('expanded');
                }
                parent = parent.parentElement ? parent.parentElement.closest('.nav-item') : null;
            }
        }
    });
}

/**
 * Mobile menu handling
 */
function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('close-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('sidebar-nav');
    
    if (!toggleBtn || !sidebar) return;
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.add('open');
        overlay.classList.add('visible');
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileSidebar);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileSidebar();
        }
    });
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar-nav');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
}

/**
 * Theme toggle
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }
}

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupThemeToggle();
});
