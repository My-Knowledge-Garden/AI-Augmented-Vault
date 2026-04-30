# Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 2: Choose Your Workflow

**For Production Build:**
```bash
npm run build
# Output: ./docs/index.html
# Ready to deploy or open in browser
```

**For Development with Live Reload:**
```bash
npm run dev
# Opens http://localhost:8080
# Auto-rebuilds when you edit markdown files
# Browser auto-refreshes on changes
```

### Step 3: Add New Pages

1. Create markdown file in `arabic-documentation/`:
   ```
   arabic-documentation/category/my-page.md
   ```

2. Add frontmatter at the top:
   ```yaml
   ---
   title: "Page Title"
   description: "Short description"
   category: "category-name"
   tags: ["tag1", "tag2"]
   date: "2026-04-30"
   status: "published"
   progress: 100
   parent: "category-name"
   public: true
   ---
   ```

3. Write your content in markdown

4. **If using dev server:** Auto-rebuilds, just refresh browser  
   **If using production:** Run `npm run build` again

### Step 4: Verify & Deploy

```bash
# Check for broken links
npm run verify-links

# Deploy docs/ folder to hosting
# GitHub Pages / Netlify / Vercel / Any web server
```

## 📁 Project Structure at a Glance

```
.
├── docs/                          ← Generated website (ready to deploy)
├── styles/                        ← CSS (main.css + normalize.css)
├── scripts/                       ← JavaScript (nav-tree.js + search.js)
├── templates/                     ← HTML templates
├── arabic-documentation/          ← Your markdown files
├── build-site.js                  ← Main build script
├── dev-server.js                  ← Live reload server
├── package.json                   ← npm scripts & dependencies
└── BUILD.md                       ← Full documentation
```

## 🎨 What You Get

✅ **Beautiful dark theme** with grainy gradient background  
✅ **Mobile-first design** that works on all devices  
✅ **RTL support** for Arabic text  
✅ **Full-text search** across all pages  
✅ **Hierarchical navigation** with expandable menu  
✅ **Syntax highlighting** for code blocks  
✅ **Auto-generated table of contents** for each page  
✅ **Link verification** to catch broken links  
✅ **Live reload** during development  

## 📝 Frontmatter Fields (Required)

Every markdown file must include:
- `title` — Page title (shown in browser tab and headers)
- `description` — Short description (used in search results)
- `category` — Which section this belongs to
- `tags` — Array of tags for categorization
- `date` — Publication date (YYYY-MM-DD)
- `status` — "published", "draft", etc.
- `progress` — Completion percentage (0-100)
- `parent` — Parent category name
- `public` — Must be `true` to include page

## 🌍 Deployment Options

**GitHub Pages:**
```bash
npm run build
# Commit docs/ folder
# Enable Pages in repo settings
```

**Netlify:**
```bash
npm run build
# Drag & drop docs/ folder to Netlify
```

**Traditional Server:**
```bash
npm run build
# SCP docs/ to web server
# Point web server to docs/ folder
```

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | `npm install` to ensure dependencies are installed |
| Search empty | Check markdown files have proper frontmatter |
| Links broken | Run `npm run verify-links` to see broken links |
| Dev server won't reload | Kill process (Ctrl+C) and restart `npm run dev` |
| CSS looks wrong | Clear browser cache (Ctrl+Shift+R) |

## 📚 Learn More

- Full documentation: [BUILD.md](BUILD.md)
- Implementation details: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

**Questions?** Check the markdown files in `arabic-documentation/` folder for examples of properly formatted content.

**Ready to go!** 🎉
