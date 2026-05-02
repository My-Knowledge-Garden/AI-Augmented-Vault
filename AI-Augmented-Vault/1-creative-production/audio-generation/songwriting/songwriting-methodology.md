---
title: Songwriting Methodology (منهجية كتابة الأغاني)
category: Audio Generation (توليد الصوت)
parent: Songwriting (كتابة الأغاني)
description: منهجية متقدمة لتنظيم مشاريع الأغاني وإدارتها.
tags:
  - methodology
  - workflow
  - songwriting
  - process
date: 2026-05-02
progress: in-progress
public: true
status: active
---

# Songwriting Methodology

## Project Structure

```
000X.project-name/
├── 000X.project-name.md          # Folder note (project index)
├── 01.darija/                    # Moroccan Arabic versions
│   ├── 01.md
│   ├── 02.md
│   └── 03.md
├── 02.amazigh/                   # Tamazight versions
│   └── tamgrabit_amazigh-version.md
├── 03.english/                   # English translations (optional)
├── amazigh-and-darija-version/   # Bilingual versions
│   └── project_bilingual.md
├── deepsearch/                   # Research & references
│   ├── research-result.md
│   ├── key-points.md
│   └── music-style.md
└── assets/                       # Audio/Video files
    ├── demo-01.mp3
    └── cover-art.png
```

## Frontmatter Template

```yaml
---
title: Project Name - Version Type
category: Audio Generation (توليد الصوت)
parent: 000X. Project Name
description: Brief description in Arabic/English.
tags:
  - auto-generated
  - creative-production
  - language-type
  - genre
date: 2026-MM-DD
progress: in-progress | completed | on-hold
public: true | false
status: active | archived
---
```

## Version Naming Convention

| Folder | Purpose | Naming |
|--------|---------|--------|
| 01.darija | Moroccan Arabic | 01.md, 02.md, 03.md |
| 02.amazigh | Tamazight | project_amazigh-version.md |
| 03.english | English | project_english-version.md |
| bilingual | Mixed languages | project_bilingual.md |

## Workflow Stages

1. **Research (deepsearch)** - Collect references, themes, vocabulary
2. **Draft v1** - First lyrics in primary language
3. **Translations** - Create versions in other languages
4. **Refine** - Polish lyrics, rhythm, meaning
5. **Suno Links** - Add generated audio references
6. **Finalize** - Complete version with all metadata

## Tagging System

- Language tags: `darija`, `amazigh`, `english`, `bilingual`
- Stage tags: `draft`, `review`, `final`, `archived`
- Genre tags: `folk`, `pop`, `traditional`, `fusion`