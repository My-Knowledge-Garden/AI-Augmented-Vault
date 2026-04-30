const { marked } = require('marked');
const hljs = require('highlight.js');

// Track headings for TOC generation
let headings = [];

// Configure marked with custom options
marked.setOptions({
    breaks: true,
    gfm: true,
    pedantic: false
});

// Custom renderer
const renderer = new marked.Renderer();

// Override heading renderer with anchor IDs
const originalHeading = renderer.heading.bind(renderer);
renderer.heading = function(token) {
    if (!token || !token.text) return '';
    
    const text = token.text;
    const level = token.depth;
    const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    
    headings.push({
        level,
        text,
        id
    });
    
    return `<h${level} id="${id}">${text}</h${level}>\n`;
};

// Override link renderer to convert markdown links to HTML
const originalLink = renderer.link.bind(renderer);
renderer.link = function(token) {
    if (!token || !token.href) return '';
    
    let href = token.href;
    
    // Convert .md links to .html
    if (href.endsWith('.md')) {
        href = href.replace(/\.md$/, '.html');
    }
    
    const title = token.title ? ` title="${token.title}"` : '';
    return `<a href="${href}"${title}>${token.text}</a>`;
};

marked.setOptions({
    renderer,
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).highlighted;
            } catch (err) {
                console.warn(`Error highlighting code block with language ${lang}:`, err.message);
            }
        }
        return hljs.highlightAuto(code).highlighted;
    },
    langPrefix: 'hljs language-'
});

/**
 * Convert markdown content to HTML
 * @param {string} content - Raw markdown content
 * @param {object} metadata - Frontmatter metadata (optional)
 * @returns {object} - { html, toc, headings, metadata }
 */
function markdownToHtml(content, metadata = {}) {
    headings = [];
    
    const html = marked.parse(content);
    
    // Generate table of contents
    const toc = generateTOC(headings);
    
    return {
        html,
        toc,
        headings,
        metadata
    };
}

/**
 * Generate table of contents from headings
 * @param {array} headings - Array of heading objects
 * @returns {string} - HTML string for TOC
 */
function generateTOC(headings) {
    if (headings.length === 0) return '';
    
    let toc = '<nav class="toc"><h3>Contents</h3><ul>';
    let lastLevel = 1;
    
    for (const heading of headings) {
        if (heading.level === 1) continue; // Skip H1s in TOC
        
        // Handle nesting
        while (lastLevel < heading.level) {
            toc += '<ul>';
            lastLevel++;
        }
        while (lastLevel > heading.level) {
            toc += '</ul>';
            lastLevel--;
        }
        
        toc += `<li><a href="#${heading.id}">${heading.text}</a></li>`;
    }
    
    // Close remaining open tags
    while (lastLevel > 1) {
        toc += '</ul>';
        lastLevel--;
    }
    
    toc += '</ul></nav>';
    return toc;
}

module.exports = {
    markdownToHtml,
    generateTOC
};
