const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const docsPath = path.resolve(__dirname, 'docs');
const reportPath = path.resolve(__dirname, 'docs', 'link-verification-report.json');

let totalLinks = 0;
let brokenLinks = [];
let externalLinks = [];
let verifiedLinks = [];

/**
 * Check if a link target exists
 * @param {string} href - Link href
 * @param {string} baseDir - Base directory of the linking file
 * @param {string} currentFile - Current file path
 * @returns {object} - Link verification result
 */
function checkLink(href, baseDir, currentFile) {
    if (!href || href.startsWith('#')) {
        // Anchor links
        return {
            status: 'anchor',
            target: href,
            message: 'Anchor link'
        };
    }
    
    if (href.startsWith('http://') || href.startsWith('https://')) {
        // External links
        return {
            status: 'external',
            target: href,
            message: 'External URL'
        };
    }
    
    if (href.startsWith('mailto:')) {
        return {
            status: 'mailto',
            target: href,
            message: 'Mailto link'
        };
    }
    
    // Relative links
    let targetPath;
    
    if (href.startsWith('/')) {
        // Absolute path from docs root
        targetPath = path.join(docsPath, href);
    } else {
        // Relative path from current file
        targetPath = path.normalize(path.join(baseDir, href));
    }
    
    // Handle directory indexes
    if (!path.extname(targetPath)) {
        const possibleTargets = [
            targetPath + '.html',
            path.join(targetPath, 'index.html')
        ];
        
        for (const target of possibleTargets) {
            if (fs.existsSync(target)) {
                return {
                    status: 'ok',
                    target: href,
                    resolvedPath: path.relative(docsPath, target)
                };
            }
        }
    } else {
        if (fs.existsSync(targetPath)) {
            return {
                status: 'ok',
                target: href,
                resolvedPath: path.relative(docsPath, targetPath)
            };
        }
    }
    
    return {
        status: 'broken',
        target: href,
        resolvedPath: path.relative(docsPath, targetPath),
        message: 'Target not found'
    };
}

/**
 * Extract and verify links from HTML file
 * @param {string} filePath - HTML file path
 * @param {string} relativePath - Relative path from docs root
 * @returns {array} - Verification results
 */
function verifyLinksInFile(filePath, relativePath) {
    try {
        const html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);
        const baseDir = path.dirname(filePath);
        const results = [];
        
        // Check all links
        $('a[href]').each((index, element) => {
            const href = $(element).attr('href');
            totalLinks++;
            
            if (!href) return;
            
            const result = checkLink(href, baseDir, filePath);
            const verification = {
                file: relativePath,
                line: index, // Note: cheerio doesn't provide line numbers
                link: href,
                ...result
            };
            
            results.push(verification);
            
            if (result.status === 'broken') {
                brokenLinks.push(verification);
            } else if (result.status === 'external') {
                externalLinks.push(verification);
            } else if (result.status === 'ok') {
                verifiedLinks.push(verification);
            }
        });
        
        return results;
    } catch (err) {
        console.error(`Error verifying ${filePath}:`, err.message);
        return [];
    }
}

/**
 * Recursively scan and verify all HTML files
 * @param {string} dir - Directory to scan
 * @param {string} relPath - Relative path from docs root
 * @returns {array} - All verification results
 */
function scanAndVerify(dir, relPath = '') {
    const results = [];
    
    if (!fs.existsSync(dir)) {
        console.warn(`Directory not found: ${dir}`);
        return results;
    }
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const itemRelPath = relPath ? `${relPath}/${item.name}` : item.name;
        
        if (item.isDirectory() && item.name !== '.git' && !item.name.startsWith('.')) {
            results.push(...scanAndVerify(fullPath, itemRelPath));
        } else if (item.name.endsWith('.html')) {
            results.push(...verifyLinksInFile(fullPath, itemRelPath));
        }
    }
    
    return results;
}

/**
 * Generate CSV report
 * @returns {string} - CSV content
 */
function generateCsvReport() {
    const brokenReport = brokenLinks.map(link => 
        `${link.file},"${link.link}","${link.resolvedPath}","${link.message}"`
    ).join('\n');
    
    const header = 'File,Link,Resolved Path,Status\n';
    return header + brokenReport;
}

/**
 * Main verification process
 */
function verify() {
    console.log('🔗 Starting link verification...\n');
    
    const allResults = scanAndVerify(docsPath);
    
    // Generate reports
    const report = {
        timestamp: new Date().toISOString(),
        statistics: {
            totalFiles: new Set(allResults.map(r => r.file)).size,
            totalLinks: totalLinks,
            brokenLinks: brokenLinks.length,
            externalLinks: externalLinks.length,
            verifiedLinks: verifiedLinks.length,
            anchorLinks: allResults.filter(r => r.status === 'anchor').length
        },
        brokenLinks: brokenLinks.map(link => ({
            file: link.file,
            link: link.link,
            resolvedPath: link.resolvedPath,
            message: link.message
        })),
        report: generateCsvReport()
    };
    
    // Write JSON report
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    // Write CSV report
    const csvPath = reportPath.replace('.json', '.csv');
    fs.writeFileSync(csvPath, report.report, 'utf8');
    
    // Console output
    console.log('═════════════════════════════════════');
    console.log('Link Verification Report');
    console.log('═════════════════════════════════════');
    console.log(`Total files: ${report.statistics.totalFiles}`);
    console.log(`Total links checked: ${report.statistics.totalLinks}`);
    console.log(`✓ Valid links: ${report.statistics.verifiedLinks}`);
    console.log(`🔗 External links: ${report.statistics.externalLinks}`);
    console.log(`⚓ Anchor links: ${report.statistics.anchorLinks}`);
    console.log(`✗ Broken links: ${report.statistics.brokenLinks}`);
    console.log('═════════════════════════════════════\n');
    
    if (brokenLinks.length > 0) {
        console.log('🚨 BROKEN LINKS FOUND:\n');
        brokenLinks.forEach(link => {
            console.log(`  File: ${link.file}`);
            console.log(`  Link: ${link.link}`);
            console.log(`  Expected: ${link.resolvedPath}`);
            console.log('');
        });
    } else {
        console.log('✨ All links verified successfully!\n');
    }
    
    console.log(`📄 Reports generated:`);
    console.log(`  JSON: ${reportPath}`);
    console.log(`  CSV: ${csvPath}`);
}

// Run verification
verify();
