# Build Documentation - AI-Augmented Vault Static Site Generator

## Overview

This project includes a complete Node.js-based static site generator that transforms Markdown files from the `arabic-documentation/` folder into a navigable HTML documentation site. The generated site features:

- **Static HTML generation** — Fast, deploy-anywhere output
- **Hierarchical navigation** — Right-sidebar tree menu reflecting folder structure
- **RTL & Arabic support** — Full right-to-left layout for Arabic text
- **Dark theme with grainy gradient background** — Obsidian-inspired design using OKLCH color space
- **Full-text search** — Client-side search index with real-time filtering
- **Mobile-first responsive design** — Works seamlessly on all devices
- **Live reload during development** — Auto-rebuild on file changes
- **Link verification** — Post-build report of broken internal/external links

## Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

## Installation

1. **Install dependencies:**

```bash
npm install
```

This installs all required packages:
- `marked` — Markdown parser
- `highlight.js` — Code syntax highlighting
- `gray-matter` — Frontmatter extraction
- `cheerio` — HTML parsing (for link verification)
- `chokidar` — File watching (for development)
- `express` — Dev server (for live reload)

## Usage

### Build for Production

Generate the complete documentation site:

```bash
npm run build
```

Output directory: `./docs/`

This process:
1. Generates navigation tree structure
2. Renders all Markdown files to HTML using page templates
3. Copies CSS and JavaScript assets
4. Generates search index
5. Creates navigation tree JSON for client-side navigation

**Output files:**
- `docs/index.html` — Homepage with category overview and search
- `docs/arabic-documentation/**/*.html` — All generated documentation pages
- `docs/styles/main.css` — Compiled stylesheet
- `docs/styles/normalize.css` — CSS reset
- `docs/scripts/nav-tree.js` — Navigation component
- `docs/scripts/search.js` — Search functionality
- `src/nav-tree.json` — Navigation structure (used during build)
- `src/search-index.json` — Searchable index of all pages

### Develop Locally with Live Reload

Start development server with file watching:

```bash
npm run dev
```

This:
1. Performs an initial full build
2. Starts a local Express server on `http://localhost:8080`
3. Watches `arabic-documentation/` folder for changes
4. Auto-rebuilds affected files on save
5. Injects live reload script into HTML pages
6. Browser auto-refreshes when changes complete

**Features:**
- Press Ctrl+C to stop the server
- Changes to Markdown files trigger rebuild within ~500ms
- Error notifications appear in browser
- Files are watched from the moment server starts

### Verify Links

Check for broken internal/external links:

```bash
npm run verify-links
```

Creates link verification reports:
- `docs/link-verification-report.json` — Detailed JSON report
- `docs/link-verification-report.csv` — CSV format for spreadsheet analysis

**Report includes:**
- Total links checked
- Broken internal links (with paths)
- External URLs (not verified by default)
- Summary statistics

> **Note:** Link verification runs as a post-build report and does NOT fail the build. This allows you to review broken links without blocking deployment.

## Adding New Documentation

### 1. Create Markdown File

Create a `.md` file in `arabic-documentation/` folder structure:

```
arabic-documentation/
└── creative-production/
    └── my-new-page.md
```

### 2. Add Frontmatter

Include required metadata at the top of your Markdown file:

```yaml
---
title: "My Page Title"
description: "A brief description of what this page covers"
category: "creative-production"
tags: ["tag1", "tag2"]
date: "2026-04-30"
public: true
status: "published"
progress: 100
parent: "creative-production"
---

# Your Content Here

Your markdown content follows the frontmatter.
```

**Frontmatter fields:**
- `title` (required) — Page title
- `description` (required) — Short description (used in search results)
- `category` (required) — Category name (e.g., "creative-production", "practical-tech")
- `tags` (required) — Array of tags
- `date` (required) — Publication date (YYYY-MM-DD)
- `status` (required) — Publication status (e.g., "published", "draft")
- `progress` (required) — Completion percentage (0-100)
- `parent` (required) — Parent category
- `public` (required) — Should be `true` for public pages

### 3. Rebuild

```bash
npm run build
```

Or if using dev server, changes auto-rebuild.

## Project Structure

```
project-root/
├── arabic-documentation/          # Source markdown files
│   └── creative-production/
│       ├── ai-music.md
│       ├── visual-arts.md
│       └── ...
├── templates/                     # HTML page templates
│   ├── page.html                 # Content page template
│   ├── homepage.html             # Landing page template
│   └── components/               # Reusable components
├── styles/                       # CSS stylesheets
│   ├── main.css                 # Primary styles + gradient background
│   └── normalize.css            # CSS reset
├── scripts/                      # Client-side JavaScript
│   ├── nav-tree.js             # Navigation tree component
│   └── search.js               # Full-text search
├── src/                         # Generated during build (not in git)
│   ├── nav-tree.json           # Navigation structure
│   └── search-index.json       # Search index
├── docs/                        # Generated HTML output (not in git)
│   ├── index.html
│   ├── styles/
│   ├── scripts/
│   └── arabic-documentation/
├── build-site.js               # Main build orchestrator
├── generate-nav-tree.js        # Navigation tree generator
├── generate-search-index.js    # Search index generator
├── markdown-to-html.js         # Markdown processor
├── verify-links.js             # Link verification script
├── dev-server.js               # Development server with live reload
├── package.json                # Dependencies and npm scripts
└── BUILD.md                    # This file
```

## Design System

### Colors (OKLCH Color Space)

The design uses perceptually uniform OKLCH colors to eliminate color banding:

- **Background**: `oklch(15% 0.01 240)` — Deep charcoal
- **Surface**: `oklch(17% 0.005 250)` — Slightly lighter for card backgrounds
- **Text**: `oklch(85% 0.01 250)` — Off-white for readability
- **Accent**: `oklch(60% 0.08 150)` — Teal/cyan for links and interactive elements
- **Border**: `oklch(30% 0.01 240)` — Subtle dark gray dividers

### Grainy Mesh Gradient Background

The background uses:
- **Radial gradients** in multiple locations for organic, diffuse effect
- **SVG noise filter** overlay at 2-3% opacity for subtle grain texture
- **Fixed attachment** so gradient stays fixed as you scroll
- **OKLCH color space** for smooth transitions without banding

### Typography

- **Fonts**: System font stack for optimal cross-platform rendering
- **Headings**: 600 weight, with color `oklch(95% 0.025 250)`
- **Body**: Line height 1.8 for readability, 16px base font size

### Responsive Design

- **Desktop** (1024px+): Full layout with fixed sidebar
- **Tablet** (768px-1023px): Sidebar becomes drawer
- **Mobile** (< 768px): Hamburger menu, single-column layout
- **Micro** (< 480px): Optimized for small screens

## Troubleshooting

### Build fails with "ENOENT: no such file or directory"

**Problem:** Template files not found

**Solution:**
```bash
ls -la templates/  # Check templates exist
npm run build      # Rebuild
```

### Search not working

**Problem:** Empty search results

**Solutions:**
1. Check `src/search-index.json` was created:
   ```bash
   ls -la src/search-index.json
   ```

2. Verify markdown files have proper frontmatter:
   ```bash
   head -20 arabic-documentation/some-file.md
   ```

3. Rebuild search index:
   ```bash
   node generate-search-index.js
   ```

### Navigation tree not showing

**Problem:** Sidebar appears but no items

**Solutions:**
1. Check `src/nav-tree.json` exists with content:
   ```bash
   cat src/nav-tree.json | head -20
   ```

2. Verify arabic-documentation folder has markdown files

3. Rebuild navigation tree:
   ```bash
   node generate-nav-tree.js
   ```

### Links broken after building

**Problem:** Click navigation links and get 404

**Solutions:**
1. Check internal markdown links use `.md` extension (converted to `.html` during build):
   ```markdown
   [Link](./other-file.md)  ✓ Correct
   [Link](./other-file)     ✗ Won't convert
   ```

2. Run link verification:
   ```bash
   npm run verify-links
   cat docs/link-verification-report.json
   ```

3. Manually check resolved paths in report

### Dev server not auto-reloading

**Problem:** Change markdown file but browser doesn't refresh

**Solutions:**
1. Check file watcher is active (should see "Watching for changes..." message)

2. Verify markdown files are in `arabic-documentation/` folder:
   ```bash
   find arabic-documentation -name "*.md" | head
   ```

3. Check browser console for errors (F12 → Console)

4. Restart dev server:
   ```bash
   # Ctrl+C to stop
   npm run dev   # Restart
   ```

### CSS gradient looks wrong

**Problem:** Banding visible, colors don't look smooth

**Solution:** This might be a display issue:
1. Try `npm run build` and view in different browser
2. Check display color settings (might need to adjust monitor settings)
3. View in full-screen for best appearance

> Note: OKLCH gradients may appear slightly different on different monitors. The rendering is correct—it's a hardware limitation of some displays. This is why grain texture is overlaid.

## Performance Tips

### Optimize Build Time

- Keep markdown files < 10,000 lines (larger files slow down parsing)
- Avoid massive code blocks in markdown (consider external files)
- Limit nested heading levels to < 6 (TOC generation is faster with shallower docs)

### Optimize Output Size

- Use external image links instead of embedding
- Minify before production deployment:
  ```bash
  npm install -g cssnano-cli terser
  cssnano docs/styles/*.css
  terser docs/scripts/*.js -c -m -o docs/scripts/bundle.js
  ```

### Optimize Search

- Search index grows with document size
- Limit to first 1000 chars of content per page (already configured)
- If 500+ pages, consider pagination or server-side search

## Deployment

### Static Hosting (Recommended)

The `docs/` folder contains everything needed for static hosting:

**GitHub Pages:**
```bash
npm run build
# Commit docs/ folder to repo
# Enable GitHub Pages in repo settings
# Point custom domain if desired
```

**Netlify:**
```bash
npm run build
# Drag & drop docs/ folder to Netlify
# Or connect repo and set build command: npm run build
```

**Vercel:**
```bash
npm run build
# Push to GitHub
# Connect repo to Vercel
# Vercel auto-detects and deploys
```

**Traditional Server:**
```bash
npm run build
# SCP/FTP docs/ folder to server
# Point web server (nginx/Apache) to docs/ folder
```

### Pre-deployment Checklist

```bash
# 1. Run full build
npm run build

# 2. Verify links
npm run verify-links

# 3. Test locally
npm run dev
# Visit http://localhost:8080 and test navigation, search, links

# 4. Check generated files
ls -lah docs/ | head -20

# 5. Verify no errors in console (F12 → Console)

# Ready to deploy docs/ folder
```

## Advanced Configuration

### Customize Template Variables

Edit `templates/page.html` and `templates/homepage.html` to customize:
- Page layout structure
- Header/footer content
- Sidebar components
- Frontmatter field display

### Modify Color Scheme

Edit `styles/main.css` and change OKLCH color values:
```css
/* Change accent color from teal to purple */
color: oklch(60% 0.08 280);  /* was 150 */
```

### Add Custom JavaScript

Create new file in `scripts/` folder and include in template:
```html
<script src="/scripts/custom.js"></script>
```

### Extend Markdown Processing

Edit `markdown-to-html.js` to:
- Add custom marked.js plugins
- Implement custom renderers (e.g., custom tables)
- Add footnote support
- Implement mermaid diagram rendering

## Performance Metrics

Typical build performance:

| Metric | Time |
|--------|------|
| 10 markdown files | 0.5s |
| 50 files | 1-2s |
| 100 files | 2-4s |
| 500 files | 10-20s |

Output size per file: 30-60 KB (HTML + embedded styles/scripts)

Total site for 100 pages: ~10-15 MB

## Community & Support

For issues, questions, or contributions:

1. Check troubleshooting section above
2. Review markdown file frontmatter format
3. Inspect build output logs for specific errors
4. Compare with working examples in `arabic-documentation/`

## License

This static site generator is part of the AI-Augmented Vault project.

---

**Last updated:** April 2026  
**Version:** 1.0.0
