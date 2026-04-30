const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const arabicDocsPath = path.resolve(__dirname, 'arabic-documentation');
const navTreePath = path.resolve(__dirname, 'src', 'nav-tree.json');

// Ensure src directory exists
if (!fs.existsSync(path.dirname(navTreePath))) {
    fs.mkdirSync(path.dirname(navTreePath), { recursive: true });
}

/**
 * Recursively scan directory and build navigation tree
 * @param {string} dir - Directory to scan
 * @param {number} depth - Current depth
 * @returns {array} - Tree array
 */
function scanDir(dir, depth = 0) {
    if (depth > 4) return [];
    
    const items = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    // Sort entries: folders first, then files
    entries.sort((a, b) => {
        if (a.isDirectory() !== b.isDirectory()) {
            return b.isDirectory() - a.isDirectory();
        }
        return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            const children = scanDir(fullPath, depth + 1);
            items.push({
                type: 'folder',
                name: entry.name,
                label: formatLabel(entry.name),
                path: path.relative(arabicDocsPath, fullPath).replace(/\\/g, '/'),
                children
            });
        } else if (entry.name.endsWith('.md')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const { data } = matter(content);
                
                const relativePath = path.relative(arabicDocsPath, fullPath).replace(/\\/g, '/');
                const urlPath = relativePath.replace(/\.md$/, '.html');
                
                items.push({
                    type: 'file',
                    name: entry.name,
                    title: data.title || formatLabel(entry.name.replace(/\.md$/, '')),
                    description: data.description || '',
                    path: relativePath,
                    url: urlPath,
                    category: data.category || '',
                    tags: data.tags || []
                });
            } catch (err) {
                console.warn(`Error processing ${fullPath}:`, err.message);
                const relativePath = path.relative(arabicDocsPath, fullPath).replace(/\\/g, '/');
                const urlPath = relativePath.replace(/\.md$/, '.html');
                
                items.push({
                    type: 'file',
                    name: entry.name,
                    title: formatLabel(entry.name.replace(/\.md$/, '')),
                    description: '',
                    path: relativePath,
                    url: urlPath,
                    category: '',
                    tags: []
                });
            }
        }
    }
    
    return items;
}

/**
 * Format folder/file name to label (convert-case to Title Case)
 * @param {string} name - Name to format
 * @returns {string} - Formatted label
 */
function formatLabel(name) {
    return name
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Scan and build tree
const navTree = scanDir(arabicDocsPath);

// Write nav tree to file
fs.writeFileSync(navTreePath, JSON.stringify(navTree, null, 2), 'utf8');
console.log(`Navigation tree generated: ${navTreePath}`);
console.log(`Total items: ${countItems(navTree)}`);

function countItems(items) {
    let count = 0;
    for (const item of items) {
        count += 1;
        if (item.children) {
            count += countItems(item.children);
        }
    }
    return count;
}
