const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const vaultPath = path.resolve(__dirname, 'AI-Augmented-Vault');
const manifestPath = path.resolve(__dirname, 'manifest.json');
const manifest = [];
const requiredFields = ['title', 'description', 'category', 'parent', 'tags', 'date', 'progress', 'status'];
let scannedFiles = 0;
let includedFiles = 0;
let skippedFiles = 0;

function hasRequiredFields(data) {
    return requiredFields.every(field => data[field] !== undefined && data[field] !== null && data[field] !== '');
}

function isPublic(data) {
    return data.public === true || data.public === 'true';
}

function scanDir(dir, depth = 0) {
    if (depth > 4) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath, depth + 1);
        } else if (item.endsWith('.md')) {
            scannedFiles += 1;
            const content = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(content);
            const missingFields = requiredFields.filter(field => data[field] === undefined || data[field] === null || data[field] === '');
            const publicValue = isPublic(data);

            if (hasRequiredFields(data) && publicValue) {
                manifest.push({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    parent: data.parent,
                    tags: data.tags,
                    date: data.date,
                    progress: data.progress,
                    public: data.public,
                    status: data.status,
                    filePath: path.relative(vaultPath, fullPath).replace(/\\/g, '/')
                });
                includedFiles += 1;
            } else {
                skippedFiles += 1;
                console.log(`Skipping ${path.relative(vaultPath, fullPath)} - public=${data.public} ${missingFields.length ? 'missing=' + missingFields.join(',') : ''}`);
            }
        }
    }
}

scanDir(vaultPath);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Scanned ${scannedFiles} Markdown files. Included ${includedFiles}, skipped ${skippedFiles}.`);
console.log(`Manifest written to ${manifestPath}`);
