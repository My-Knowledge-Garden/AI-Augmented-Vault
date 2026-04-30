# هيكل المجلدات والملفات

## شرح تفصيلي لبنية المشروع والملفات

يشرح هذا الملف بالتفصيل كيف ينظّم المشروع الملفات والمجلدات.

---

## 1️⃣ البنية الكاملة للمشروع

### 1.1 الجذر الرئيسي

```
AI-Augmented-Vault/  (الجذر الرئيسي للمشروع)
│
├── 📄 ملفات التكوين والمشروع
│   ├── package.json              (معلومات المشروع والمكتبات)
│   ├── package-lock.json         (قفل إصدارات المكتبات)
│   ├── .gitignore               (ملفات لا تُرفع على Git)
│   └── README.md                (الملف الأساسي للشرح)
│
├── 📄 ملفات الواجهة (Frontend)
│   ├── index.html               (الصفحة الرئيسية)
│   ├── script.js                (المنطق والتفاعل)
│   └── style.css                (التنسيق والألوان)
│
├── 📄 ملفات البيانات والأدوات
│   ├── manifest.json            (قاموس المحتوى - مُنشأ تلقائياً)
│   ├── generate-manifest.js     (أداة إنشاء البيانات الوصفية)
│   ├── build_vault.py           (أداة بناء القبو)
│   └── categories.md            (قائمة الفئات)
│
├── 📁 المحتوى الرئيسي
│   └── AI-Augmented-Vault/      (مجلد المحتوى الأساسي)
│       ├── 1-creative-production/
│       ├── 2-radical-discourse/
│       ├── 3-practical-tech/
│       └── 4-knowledge-management/
│
├── 📁 المكتبات (تُنشأ تلقائياً)
│   └── node_modules/            (مكتبات Node.js)
│
└── 📁 التوثيق الإضافي
    └── arabic-documentation/    (هذا المجلد!)
```

---

## 2️⃣ ملفات الجذر الرئيسي بالتفصيل

### 2.1 package.json

**الموقع:** جذر المشروع

**الوظيفة:** 
- تحديد معلومات المشروع
- إدارة المكتبات والمتعلقات
- تعريف الأوامر المتاحة

**المحتوى:**
```json
{
  "name": "ai-augmented_second_brain",
  "version": "1.0.0",
  "description": "مشروع قبو الذكاء الاصطناعي المعزز",
  "main": "generate-manifest.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "gray-matter": "^4.0.3"
  }
}
```

### 2.2 index.html

**الموقع:** جذر المشروع

**الوظيفة:**
- الصفحة الرئيسية
- الواجهة التفاعلية
- نقطة البداية للمستخدم

**المكونات:**
- `<head>`: المعلومات الأساسية والربط مع CSS
- `<body>`: محتوى الواجهة الرئيسية
- الربط مع `script.js`

### 2.3 script.js

**الموقع:** جذر المشروع

**الوظيفة:**
- منطق الواجهة التفاعلية
- تحميل البيانات من manifest.json
- معالجة أحداث المستخدم

**المكونات الرئيسية:**
```javascript
// تحميل البيانات
function loadManifest() { }

// عرض المحتوى
function displayContent() { }

// البحث والتصفية
function searchContent() { }

// معالجة الأحداث
document.addEventListener('DOMContentLoaded', init);
```

### 2.4 style.css

**الموقع:** جذر المشروع

**الوظيفة:**
- تنسيق الواجهة
- الألوان والخطوط
- دعم الاتجاه RTL (العربية)

**المقاطع الرئيسية:**
```css
/* متغيرات CSS */
:root { --primary-color: ...; }

/* تنسيق HTML */
body { direction: rtl; }

/* المكونات */
.header { }
.sidebar { }
.content { }
```

### 2.5 generate-manifest.js

**الموقع:** جذر المشروع

**الوظيفة:**
- مسح جميع ملفات .md
- استخراج البيانات الوصفية (Front Matter)
- إنشاء manifest.json

**الخطوات:**
```javascript
1. البحث عن ملفات .md
2. قراءة Front Matter
3. التحقق من الحقول المطلوبة
4. إنشاء JSON
5. حفظ manifest.json
```

### 2.6 build_vault.py

**الموقع:** جذر المشروع

**الوظيفة:**
- أداة Python لبناء وصيانة القبو
- معالجة متقدمة للملفات

**الأوامر المتاحة:**
```bash
python build_vault.py --help
python build_vault.py --build
python build_vault.py --clean
```

---

## 3️⃣ مجلد المحتوى الرئيسي

### 3.1 الفئات الأربع الرئيسية

```
AI-Augmented-Vault/
│
├── 1-creative-production/       (الإنتاج الإبداعي)
├── 2-radical-discourse/         (الخطاب الجذري)
├── 3-practical-tech/            (الحلول التقنية)
└── 4-knowledge-management/      (إدارة المعرفة)
```

### 3.2 الفئة 1: الإنتاج الإبداعي

```
1-creative-production/
│
├── audio-generation/            (توليد الصوت)
│   ├── ai-music/
│   │   └── ai-music.md          (الموسيقى المولدة بالذكاء الاصطناعي)
│   └── songwriting/
│       └── songwriting.md        (الكتابة الغنائية)
│
└── visual-arts/                 (الفنون البصرية)
    ├── 3d-design/
    │   └── 3d-design.md          (التصميم ثلاثي الأبعاد)
    └── video-creation/
        └── video-creation.md     (إنشاء الفيديو)
```

### 3.3 الفئة 2: الخطاب الجذري

```
2-radical-discourse/
│
├── analytical-writing/          (الكتابة التحليلية)
│   ├── political-economic-critique/
│   │   └── political-economic-critique.md
│   └── religious-analysis/
│       └── religious-analysis.md
│
└── philosophical-framework/     (الإطار الفلسفي)
    ├── radical-perspectives/
    │   └── radical-perspectives.md
    └── realistic-philosophy/
        └── realistic-philosophy.md
```

### 3.4 الفئة 3: الحلول التقنية

```
3-practical-tech/
│
├── maintenance/                 (الصيانة والإصلاح)
│   ├── a-simple-way-to-structure-under_Home-Appliance-Fixes.md
│   ├── hardware-repair/
│   │   └── hardware-repair.md
│   └── home-repairs/
│       └── home-repairs.md
│
└── software-building/           (تطوير البرمجيات)
    ├── ai-development/
    │   └── ai-development.md
    ├── automation-scripts/
    │   └── automation-scripts.md
    └── simple-web-pages/
        └── simple-web-pages.md
```

### 3.5 الفئة 4: إدارة المعرفة

```
4-knowledge-management/
│
├── experimental-infrastructure/ (البنية التجريبية)
│   ├── knowledge-tree/
│   │   └── knowledge-tree.md
│   └── second-brain/
│       └── second-brain.md
│
└── information-synthesis/       (تجميع المعلومات)
    └── trial-error-structuring/
        └── trial-error-structuring.md
```

---

## 4️⃣ ملفات Markdown

### 4.1 بنية ملف Markdown

```markdown
---
title: عنوان الملف
description: وصف قصير
category: 1-creative-production
tags: [tag1, tag2]
public: true
author: اسم المؤلف
date: 2026-04-30
---

# محتوى الملف

## القسم الأول
نصك هنا...

## القسم الثاني
مزيد من النصوص...
```

### 4.2 الحقول المطلوبة

| الحقل | النوع | الوصف |
|------|-------|-------|
| title | نص | العنوان الرئيسي |
| description | نص | وصف قصير |
| category | نص | الفئة (1-4) |
| tags | مصفوفة | وسوم مفتاحية |
| public | منطقي | نشر أو خاص |
| author | نص | اسم المؤلف |
| date | تاريخ | تاريخ الإنشاء |

---

## 5️⃣ مجلد node_modules (تُنشأ تلقائياً)

### 5.1 الوظيفة

```
node_modules/
│
└── المكتبات المثبتة
    ├── gray-matter/             (المكتبة الرئيسية)
    ├── dependencies/            (متعلقات gray-matter)
    └── ...
```

### 5.2 ملاحظات مهمة

- **لا تعدّل** الملفات في هذا المجلد
- **لا تنسخ** هذا المجلد في Git
- **أعد التثبيت** بـ `npm install` عند الحاجة

---

## 6️⃣ ملف .gitignore

### 6.1 الملفات المستثناة

```
# لا تُرفع على Git
node_modules/
.env
*.log
.DS_Store
dist/
build/
```

### 6.2 الفائدة

- حفظ المجلدات الكبيرة من الرفع
- حماية البيانات الحساسة
- تنظيف المستودع

---

## 7️⃣ ملف manifest.json (مُولّد تلقائياً)

### 7.1 الموقع

**جذر المشروع** (ينشأ بعد تشغيل `generate-manifest.js`)

### 7.2 المحتوى

```json
{
  "generated": "2026-04-30T10:30:00Z",
  "totalFiles": 25,
  "categories": {
    "1-creative-production": 7,
    "2-radical-discourse": 7,
    "3-practical-tech": 9,
    "4-knowledge-management": 6
  },
  "content": [
    {
      "id": "unique-id",
      "title": "...",
      "filePath": "...",
      ...
    }
  ]
}
```

---

## 8️⃣ مجلد arabic-documentation

### 8.1 الموقع والبنية

```
arabic-documentation/           (هذا المجلد!)
│
├── overview/                   (نظرة عامة)
├── setup-installation/         (إعداد وتثبيت)
├── architecture/               (العمارة والبنية)
├── creative-production/        (الإنتاج الإبداعي)
├── radical-discourse/          (الخطاب الجذري)
├── practical-tech/             (الحلول التقنية)
├── knowledge-management/       (إدارة المعرفة)
├── guides/                     (أدلة ونصائح)
└── glossary-and-references/    (مسرد ومراجع)
```

### 8.2 الفائدة

- توثيق شامل باللغة العربية
- سهل الوصول والتصفح
- منظم وواضح

---

## 9️⃣ قواعد تسمية الملفات والمجلدات

### 9.1 معايير التسمية

**المجلدات:**
- صيغة: `name-like-this` (params-case)
- مثال: `creative-production`, `radical-discourse`

**الملفات:**
- صيغة: `file-name.md` (params-case)
- مثال: `ai-music.md`, `political-economic-critique.md`

### 9.2 أمثلة صحيحة

✅ `ai-music.md`
✅ `songwriting-guide.md`
✅ `political-economic-critique.md`

### 9.3 أمثلة خاطئة

❌ `AiMusic.md` (PascalCase)
❌ `ai_music.md` (snake_case)
❌ `AI MUSIC.md` (مسافات)

---

## 🔟 ملخص الملفات الهامة

| الملف | الموقع | النوع | الوظيفة |
|------|--------|-------|--------|
| index.html | جذر | Frontend | الصفحة الرئيسية |
| script.js | جذر | Frontend | المنطق |
| style.css | جذر | Frontend | التنسيق |
| package.json | جذر | Config | المشروع |
| generate-manifest.js | جذر | Build | إنشاء البيانات |
| manifest.json | جذر | Data | البيانات الوصفية |
| build_vault.py | جذر | Build | أداة البناء |

---

## قائمة فحص البنية

```
☐ وجود جميع ملفات الجذر
☐ وجود مجلد AI-Augmented-Vault/
☐ وجود الفئات الأربع
☐ وجود ملفات .md في كل مجلد
☐ وجود Front Matter في كل ملف
☐ عدم وجود أخطاء في paths
☐ صحة تسمية الملفات والمجلدات
☐ وجود manifest.json بعد التنفيذ
```

---

**للمزيد من التفاصيل:**
- [system-architecture.md](#) - العمارة العامة
- [data-flow.md](#) - تدفق البيانات
- [technical-specifications.md](#) - المواصفات التقنية

---

**آخر تحديث**: 30 أبريل 2026
