const fs = require('fs');
const path = require('path');
const express = require('express');
const chokidar = require('chokidar');
const { execSync } = require('child_process');

const app = express();
const PORT = 8080;
const docsPath = path.resolve(__dirname, 'docs');
const arabicDocsPath = path.resolve(__dirname, 'arabic-documentation');

let clients = [];
let rebuildInProgress = false;

/**
 * Queue for rebuild requests (debounced)
 */
let rebuildTimeout;
function queueRebuild(changedFile) {
    clearTimeout(rebuildTimeout);
    rebuildTimeout = setTimeout(() => {
        if (!rebuildInProgress) {
            performRebuild(changedFile);
        }
    }, 500); // Wait 500ms after last change before rebuilding
}

/**
 * Perform build
 */
function performRebuild(changedFile) {
    if (rebuildInProgress) return;
    
    rebuildInProgress = true;
    console.log(`\n🔄 Rebuilding... (changed: ${path.basename(changedFile)})\n`);
    
    try {
        // Run build script
        execSync('node build-site.js', { 
            stdio: 'inherit',
            cwd: __dirname 
        });
        
        console.log('\n✅ Build complete!\n');
        
        // Notify all connected clients to reload
        notifyClients('reload');
        
    } catch (err) {
        console.error('\n❌ Build failed:', err.message, '\n');
        notifyClients('error', err.message);
    } finally {
        rebuildInProgress = false;
    }
}

/**
 * Send event to all connected clients
 */
function notifyClients(event, data = null) {
    const message = JSON.stringify({ event, data });
    clients.forEach(res => {
        try {
            res.write(`data: ${message}\n\n`);
        } catch (err) {
            // Client connection closed
        }
    });
}

/**
 * Setup file watcher
 */
function setupWatcher() {
    console.log('👁️  Watching for changes...\n');
    
    const watcher = chokidar.watch(arabicDocsPath, {
        ignored: /(node_modules|\.git|\.DS_Store)/,
        persistent: true,
        awaitWriteFinish: {
            stabilityThreshold: 100
        }
    });
    
    watcher
        .on('add', file => {
            console.log(`📝 New file: ${path.relative(__dirname, file)}`);
            queueRebuild(file);
        })
        .on('change', file => {
            console.log(`✏️  Changed: ${path.relative(__dirname, file)}`);
            queueRebuild(file);
        })
        .on('unlink', file => {
            console.log(`🗑️  Deleted: ${path.relative(__dirname, file)}`);
            queueRebuild(file);
        });
}

/**
 * Setup Express app
 */
function setupServer() {
    // Serve static files from docs
    app.use(express.static(docsPath));
    
    // SSE endpoint for hot reload
    app.get('/events', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Send initial ping
        res.write('data: {"event":"connected"}\n\n');
        
        clients.push(res);
        
        // Remove client on disconnect
        req.on('close', () => {
            clients = clients.filter(c => c !== res);
        });
    });
    
    // Inject live reload script into HTML
    app.get('*.html', (req, res, next) => {
        const filePath = path.join(docsPath, req.path);
        
        if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf8');
            const liveReloadScript = `
            <script>
                const eventSource = new EventSource('/events');
                eventSource.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    if (data.event === 'reload') {
                        console.log('🔄 Reloading page...');
                        location.reload();
                    } else if (data.event === 'error') {
                        console.error('Build error:', data.data);
                        const errorDiv = document.createElement('div');
                        errorDiv.style.cssText = 'position:fixed;top:0;right:0;background:rgba(255,0,0,0.9);color:white;padding:1rem;z-index:9999;max-width:400px;font-size:0.9rem;border-radius:4px;';
                        errorDiv.textContent = '⚠️ Build failed. Check console for details.';
                        document.body.appendChild(errorDiv);
                        setTimeout(() => errorDiv.remove(), 5000);
                    }
                };
            </script>
            `;
            
            const modifiedHtml = html.replace('</body>', liveReloadScript + '</body>');
            res.setHeader('Content-Type', 'text/html');
            res.send(modifiedHtml);
        } else {
            next();
        }
    });
    
    // 404 handler
    app.use((req, res) => {
        res.status(404).send(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>404 Not Found</title>
                <style>
                    body {
                        font-family: system-ui;
                        background: oklch(15% 0.01 240);
                        color: oklch(85% 0.01 250);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                    }
                    h1 { font-size: 3rem; margin: 0; }
                    p { font-size: 1.2rem; color: oklch(70% 0.005 250); }
                    a { color: oklch(60% 0.08 150); text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>404</h1>
                    <p>Page not found: ${req.path}</p>
                    <p><a href="/">← Back to home</a></p>
                </div>
            </body>
            </html>
        `);
    });
}

/**
 * Main initialization
 */
function init() {
    console.log('🚀 Development server starting...\n');
    
    // Initial build
    console.log('📦 Performing initial build...\n');
    try {
        execSync('node build-site.js', { 
            stdio: 'inherit',
            cwd: __dirname 
        });
    } catch (err) {
        console.error('\n❌ Initial build failed!');
        process.exit(1);
    }
    
    // Setup Express server
    setupServer();
    
    // Setup file watcher
    setupWatcher();
    
    // Start server
    app.listen(PORT, () => {
        console.log('\n═════════════════════════════════════');
        console.log('✨ Development server running!');
        console.log('═════════════════════════════════════');
        console.log(`📱 URL: http://localhost:${PORT}`);
        console.log(`📁 Serving: ${docsPath}`);
        console.log(`👁️  Watching: ${arabicDocsPath}`);
        console.log('═════════════════════════════════════\n');
        console.log('💡 Changes to markdown files will trigger automatic rebuild and page reload\n');
        console.log('Press Ctrl+C to stop\n');
    });
}

// Handle signals
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down...');
    process.exit(0);
});

init();
