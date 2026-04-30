const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// This script is meant to be run AFTER HTML files are generated
// It reads the HTML files and builds a search index

const docsPath = path.resolve(__dirname, 'docs');
const searchIndexPath = path.resolve(__dirname, 'src', 'search-index.json');

// Ensure src directory exists
if (!fs.existsSync(path.dirname(searchIndexPath))) {
    fs.mkdirSync(path.dirname(searchIndexPath), { recursive: true });
}

/**
 * Extract searchable text/metadata from HTML file
 * @param {string} filePath - Path to HTML file
 * @param {string} urlPath - URL path for the file
 * @returns {object} - Searchable data
 */
function extractFromHtml(filePath, urlPath) {
    try {
        const html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);
        
        // Extract title
        const title = $('title').first().text().replace(' | AI-Augmented Documentation', '').trim();
        
        // Extract description from meta tag
        const description = $('meta[name="description"]').attr('content') || '';
        
        // Extract body text (remove script, style, nav-tree)
        const $contentEl = $('.content-body, .main-content').first();
        if ($contentEl.length === 0) {
            return null; // Skip if no content found
        }
        
        $contentEl.find('script, style, .toc, .nav-tree').remove();
        const content = $contentEl.text().trim();
        
        // Create searchable content preview (first 200 chars)
        const preview = content.substring(0, 200).replace(/\s+/g, ' ');
        
        // Extract category from path
        const pathParts = urlPath.split('/').filter(p => p);
        const category = pathParts[1] || 'general';
        
        return {
            title,
            description,
            url: urlPath,
            category,
            content: content.substring(0, 1000), // Store first 1000 chars for searching
            preview,
            keywords: extractKeywords(title, description, content)
        };
    } catch (err) {
        console.error(`Error extracting from ${filePath}:`, err.message);
        return null;
    }
}

/**
 * Extract keywords from content
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} content - Page content
 * @returns {array} - Keywords
 */
function extractKeywords(title, description, content) {
    const text = (title + ' ' + description + ' ' + content).toLowerCase();
    
    // Simple keyword extraction (words > 4 chars, not common words)
    const commonWords = new Set([
        'with', 'from', 'that', 'this', 'have', 'been', 'are', 'were', 'your', 'more',
        'some', 'what', 'when', 'about', 'which', 'there', 'would', 'could', 'should',
        'other', 'these', 'those', 'such', 'also', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'under', 'again', 'further', 'then', 'once'
    ]);
    
    const words = text.match(/\b\w{4,}\b/g) || [];
    const uniqueWords = [...new Set(words)].filter(w => !commonWords.has(w));
    
    return uniqueWords.slice(0, 10); // Return top 10 keywords
}

/**
 * Recursively scan docs folder for HTML files
 * @param {string} dir - Directory to scan
 * @param {string} baseUrl - Base URL path
 * @returns {array} - Search index entries
 */
function scanDocsDir(dir, baseUrl = '') {
    const entries = [];
    
    if (!fs.existsSync(dir)) {
        console.warn(`Docs directory not found: ${dir}`);
        fs.writeFileSync(searchIndexPath, JSON.stringify([], null, 2), 'utf8');
        return entries;
    }
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const urlPath = (baseUrl + '/' + item.name).replace(/^\/+/, '/');
        
        if (item.isDirectory() && item.name !== '.git') {
            entries.push(...scanDocsDir(fullPath, urlPath));
        } else if (item.name.endsWith('.html') && item.name !== 'link-verification-report.html') {
            const data = extractFromHtml(fullPath, urlPath);
            if (data) {
                entries.push(data);
            }
        }
    }
    
    return entries;
}

// Scan and build index
console.log('Building search index...');
const searchIndex = scanDocsDir(docsPath).sort((a, b) => {
    // Sort by title
    return a.title.localeCompare(b.title);
});

// Write search index to file
fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex, null, 2), 'utf8');
console.log(`Search index generated: ${searchIndexPath}`);
console.log(`Total indexed pages: ${searchIndex.length}`);
