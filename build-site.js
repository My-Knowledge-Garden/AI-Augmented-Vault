const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { markdownToHtml } = require('./markdown-to-html');

const arabicDocsPath = path.resolve(__dirname, 'arabic-documentation');
const docsOutputPath = path.resolve(__dirname, 'docs');
const templatePagePath = path.resolve(__dirname, 'templates', 'page.html');
const templateHomePage = path.resolve(__dirname, 'templates', 'homepage.html');
const navTreePath = path.resolve(__dirname, 'src', 'nav-tree.json');

// Statistics
let builtFiles = 0;
let skippedFiles = 0;
let errors = 0;

// Ensure output directory exists
if (!fs.existsSync(docsOutputPath)) {
    fs.mkdirSync(docsOutputPath, { recursive: true });
}

// Ensure src directory exists
if (!fs.existsSync(path.dirname(navTreePath))) {
    fs.mkdirSync(path.dirname(navTreePath), { recursive: true });
}

/**
 * Read template file
 */
function readTemplate(templatePath) {
    if (!fs.existsSync(templatePath)) {
        console.error(`Template not found: ${templatePath}`);
        process.exit(1);
    }
    return fs.readFileSync(templatePath, 'utf8');
}

/**
 * Generate breadcrumb HTML from file path
 */
function generateBreadcrumb(filePath) {
    const parts = filePath.split('/').filter(p => p);
    const breadcrumbs = [];
    
    breadcrumbs.push('<li><a href="/">Home</a></li>');
    
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        currentPath += '/' + part;
        const label = formatLabel(part);
        const htmlPath = parts.slice(0, i + 1).join('/') + '/index.html';
        breadcrumbs.push(`<li><a href="/${htmlPath}">${label}</a></li>`);
    }
    
    // Last part (actual page) - not a link
    const lastPart = parts[parts.length - 1].replace(/\.md$/, '');
    breadcrumbs.push(`<li class="current">${formatLabel(lastPart)}</li>`);
    
    return breadcrumbs.join('\n');
}

/**
 * Format folder/file name to label
 */
function formatLabel(name) {
    return name
        .replace(/\.md$/, '')
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Render template with context
 */
function renderTemplate(templateHtml, context) {
    let html = templateHtml;
    
    // Simple template variable replacement
    html = html.replace(/{{title}}/g, context.title || 'Untitled');
    html = html.replace(/{{description}}/g, context.description || '');
    html = html.replace(/{{breadcrumb}}/g, context.breadcrumb || '');
    html = html.replace(/{{currentPath}}/g, context.currentPath || '/');
    html = html.replace(/{{toc}}/g, context.toc || '');
    html = html.replace(/\{\{\{html\}\}\}/g, context.html || '');
    
    // Handle conditionals like {{#if metadata.date}}...{{/if}}
    html = html.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
        if (context[condition]) {
            return content;
        }
        return '';
    });
    
    // Handle handlebars-like loops (simplified)
    html = html.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, variable, content) => {
        if (!Array.isArray(context[variable])) return '';
        return context[variable].map(item => {
            let itemContent = content;
            itemContent = itemContent.replace(/{{this(\.(\w+))?}}/g, (m, prop) => {
                if (prop === '.url') return item.url || '';
                if (prop === '.title') return item.title || '';
                if (prop === '.description') return item.description || '';
                return item;
            });
            return itemContent;
        }).join('\n');
    });
    
    // Handle metadata variables
    html = html.replace(/{{metadata\.(\w+)}}/g, (match, key) => {
        return context.metadata && context.metadata[key] ? context.metadata[key] : '';
    });
    
    // Remove any remaining template syntax
    html = html.replace(/\{\{.*?\}\}/g, '');
    
    return html;
}

/**
 * Build individual markdown file to HTML
 */
function buildMarkdownFile(mdPath, relPath) {
    try {
        const content = fs.readFileSync(mdPath, 'utf8');
        const { data: metadata, content: mdContent } = matter(content);
        
        // Convert markdown to HTML
        const { html, toc } = markdownToHtml(mdContent, metadata);
        
        // Determine output path
        const htmlFileName = path.basename(mdPath).replace(/\.md$/, '.html');
        const htmlDir = path.join(docsOutputPath, path.dirname(relPath));
        const htmlPath = path.join(htmlDir, htmlFileName);
        
        // Ensure output directory exists
        if (!fs.existsSync(htmlDir)) {
            fs.mkdirSync(htmlDir, { recursive: true });
        }
        
        // Read and render template
        const templateContent = readTemplate(templatePagePath);
        const breadcrumb = generateBreadcrumb(relPath);
        const context = {
            title: metadata.title || formatLabel(htmlFileName.replace(/\.html$/, '')),
            description: metadata.description || '',
            breadcrumb,
            currentPath: '/' + relPath.replace(/\.md$/, '.html'),
            html,
            toc,
            metadata
        };
        
        const renderedHtml = renderTemplate(templateContent, context);
        
        // Write HTML file
        fs.writeFileSync(htmlPath, renderedHtml, 'utf8');
        builtFiles++;
        console.log(`✓ Built: ${relPath} → ${path.relative(docsOutputPath, htmlPath)}`);
        
        return {
            success: true,
            path: relPath,
            htmlPath: path.relative(docsOutputPath, htmlPath)
        };
    } catch (err) {
        errors++;
        console.error(`✗ Error building ${relPath}:`, err.message);
        return { success: false, path: relPath, error: err.message };
    }
}

/**
 * Recursively scan and build markdown files
 */
function scanAndBuild(dir, baseRelPath = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relPath = baseRelPath ? path.join(baseRelPath, item.name) : item.name;
        
        if (item.isDirectory()) {
            scanAndBuild(fullPath, relPath);
        } else if (item.name.endsWith('.md')) {
            buildMarkdownFile(fullPath, relPath);
        }
    }
}

/**
 * Build homepage
 */
function buildHomepage() {
    try {
        const templateContent = readTemplate(templateHomePage);
        const htmlPath = path.join(docsOutputPath, 'index.html');
        
        const context = {
            title: 'AI-Augmented Vault',
            description: 'Knowledge Hub'
        };
        
        const renderedHtml = renderTemplate(templateContent, context);
        fs.writeFileSync(htmlPath, renderedHtml, 'utf8');
        
        console.log('✓ Homepage built: index.html');
    } catch (err) {
        errors++;
        console.error('✗ Error building homepage:', err.message);
    }
}

/**
 * Copy static assets
 */
function copyAssets() {
    // Copy styles
    const stylesPath = path.join(__dirname, 'styles');
    const docsStylesPath = path.join(docsOutputPath, 'styles');
    
    if (fs.existsSync(stylesPath)) {
        if (!fs.existsSync(docsStylesPath)) {
            fs.mkdirSync(docsStylesPath, { recursive: true });
        }
        const files = fs.readdirSync(stylesPath);
        for (const file of files) {
            if (file.endsWith('.css')) {
                fs.copyFileSync(path.join(stylesPath, file), path.join(docsStylesPath, file));
            }
        }
        console.log(`✓ Copied ${files.filter(f => f.endsWith('.css')).length} CSS files`);
    }
    
    // Copy scripts
    const scriptsPath = path.join(__dirname, 'scripts');
    const docsScriptsPath = path.join(docsOutputPath, 'scripts');
    
    if (fs.existsSync(scriptsPath)) {
        if (!fs.existsSync(docsScriptsPath)) {
            fs.mkdirSync(docsScriptsPath, { recursive: true });
        }
        const files = fs.readdirSync(scriptsPath);
        for (const file of files) {
            if (file.endsWith('.js')) {
                fs.copyFileSync(path.join(scriptsPath, file), path.join(docsScriptsPath, file));
            }
        }
        console.log(`✓ Copied ${files.filter(f => f.endsWith('.js')).length} JS files`);
    }
}

/**
 * Main build process
 */
function build() {
    console.log('🚀 Starting build process...\n');
    
    // Step 1: Generate navigation tree
    console.log('📍 Generating navigation tree...');
    const navTreeScript = require('./generate-nav-tree.js');
    console.log('');
    
    // Step 2: Build homepage
    console.log('📄 Building homepage...');
    buildHomepage();
    console.log('');
    
    // Step 3: Build markdown files
    console.log('📝 Building markdown files...');
    if (fs.existsSync(arabicDocsPath)) {
        scanAndBuild(arabicDocsPath, 'arabic-documentation');
    } else {
        console.error('arabic-documentation folder not found!');
        process.exit(1);
    }
    console.log('');
    
    // Step 4: Copy assets
    console.log('📦 Copying static assets...');
    copyAssets();
    console.log('');
    
    // Step 5: Generate search index
    console.log('🔍 Generating search index...');
    const searchIndexScript = require('./generate-search-index.js');
    console.log('');
    
    // Summary
    console.log('═════════════════════════════════════');
    console.log('Build completed!');
    console.log(`  ✓ Built files: ${builtFiles}`);
    console.log(`  ✗ Errors: ${errors}`);
    console.log(`  📍 Output: ${docsOutputPath}`);
    console.log('═════════════════════════════════════\n');
    
    if (errors === 0) {
        console.log('✨ All done! Your site is ready at ./docs/');
        process.exit(0);
    } else {
        console.log(`⚠️ Build completed with ${errors} error(s)`);
        process.exit(errors > 0 ? 1 : 0);
    }
}

// Run build
build();
