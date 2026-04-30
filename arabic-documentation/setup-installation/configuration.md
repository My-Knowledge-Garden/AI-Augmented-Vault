# الإعدادات والتكوين

## خيارات التكوين والتخصيص لمشروع قبو الذكاء الاصطناعي المعزز

هذا الملف يشرح كيفية تخصيص وإعادة تكوين المشروع حسب احتياجاتك.

---

## 1️⃣ إعدادات المشروع الأساسية

### 1.1 ملف package.json

الملف الرئيسي للإعدادات:

```json
{
  "name": "ai-augmented_second_brain",
  "version": "1.0.0",
  "description": "مشروع قبو الذكاء الاصطناعي المعزز",
  "main": "generate-manifest.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 1.2 تعديل معلومات المشروع

لتخصيص معلومات المشروع:

```json
{
  "name": "اسم-مشروعك",
  "version": "2.0.0",
  "description": "وصف مشروعك",
  "author": "اسمك",
  "license": "MIT"
}
```

---

## 2️⃣ إعدادات سكريبت إنشاء البيانات الوصفية

### 2.1 تخصيص generate-manifest.js

الملف الذي ينشئ `manifest.json`:

**الإعدادات المهمة:**

```javascript
// 1. تغيير عمق البحث
// الافتراضي: 4 مستويات
const MAX_DEPTH = 4;

// 2. تحديد المجلدات المستبعدة
const EXCLUDED_FOLDERS = ['node_modules', '.git', 'archive'];

// 3. تغيير متطلبات البيانات الوصفية
// مطلوب: public: true و جميع الحقول الإجبارية
const REQUIRED_FIELDS = ['title', 'description', 'category', 'public'];
```

### 2.2 إضافة معالجات مخصصة

يمكنك إضافة معالجات خاصة للملفات:

```javascript
// معالجة خاصة لملفات معينة
if (file.endsWith('special.md')) {
  // معالجة خاصة
}
```

---

## 3️⃣ إعدادات الواجهة (UI)

### 3.1 تخصيص index.html

الملف الرئيسي للواجهة:

```html
<!-- تغيير العنوان -->
<title>اسم مشروعك</title>

<!-- تغيير الألوان والمظهر -->
<!-- عدّل في style.css -->
```

### 3.2 تعديل الألوان (style.css)

```css
/* الألوان الرئيسية */
:root {
  --primary-color: #007bff;      /* اللون الأساسي */
  --secondary-color: #6c757d;    /* اللون الثانوي */
  --success-color: #28a745;      /* لون النجاح */
  --danger-color: #dc3545;       /* لون التحذير */
}

/* تخصيص الخطوط */
body {
  font-family: 'Arabic Font Name', Arial, sans-serif;
  font-size: 16px;
  direction: rtl;  /* للعربية */
}
```

### 3.3 إضافة شعار مخصص

```html
<!-- في index.html -->
<div class="logo">
  <img src="logo.png" alt="شعار مشروعي">
  <h1>اسم مشروعي</h1>
</div>
```

---

## 4️⃣ إعدادات المحتوى

### 4.1 هيكل البيانات الوصفية (Front Matter)

كل ملف Markdown يجب أن يحتوي على:

```markdown
---
title: عنوان الملف
description: وصف قصير
category: اسم الفئة
tags: [tag1, tag2]
public: true
author: اسم المؤلف
date: 2026-04-30
---

محتوى الملف هنا...
```

### 4.2 الفئات المتاحة

تحديد الفئات المسموحة:

```
1-creative-production      (الإنتاج الإبداعي)
2-radical-discourse        (الخطاب الجذري)
3-practical-tech           (الحلول التقنية)
4-knowledge-management     (إدارة المعرفة)
```

### 4.3 الوسوم (Tags)

استخدم وسوم معيارية:

```
[AI]              (الذكاء الاصطناعي)
[tutorial]        (دليل تعليمي)
[guide]           (دليل)
[reference]       (مرجع)
[case-study]      (دراسة حالة)
[advanced]        (متقدم)
[beginner]        (مبتدئ)
```

---

## 5️⃣ إعدادات الجودة والأداء

### 5.1 تحسين الأداء

```javascript
// في script.js
const CACHE_ENABLED = true;      // تفعيل التخزين المؤقت
const LAZY_LOAD = true;           // التحميل الكسول
const COMPRESSION = true;         // ضغط البيانات
```

### 5.2 التحقق من الجودة

```bash
# فحص الملفات
npm run lint

# اختبار المشروع
npm run test

# بناء المشروع
npm run build
```

---

## 6️⃣ إعدادات الأمان

### 6.1 حماية الملفات الحساسة

```
# في .gitignore
node_modules/
.env
*.log
secrets/
build/
dist/
```

### 6.2 معايير الوصول

```
public: true       (متاح للجميع)
public: false      (خاص)
access: admin      (فقط المسؤول)
access: team       (فريق معين)
```

---

## 7️⃣ إعدادات اللغة والترجمة

### 7.1 تعيين اللغة

```html
<!-- في index.html -->
<html lang="ar" dir="rtl">
  <!-- محتوى عربي من اليمين لليسار -->
</html>
```

### 7.2 دعم لغات متعددة

```javascript
const LANGUAGES = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch'
};
```

### 7.3 ملفات ترجمة

```json
// translations/ar.json
{
  "home": "الرئيسية",
  "about": "حول",
  "contact": "اتصل بنا"
}
```

---

## 8️⃣ إعدادات التخزين والنسخ الاحتياطية

### 8.1 النسخ الاحتياطية التلقائية

```bash
# سكريبت للنسخ الاحتياطية
#!/bin/bash
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
cp -r AI-Augmented-Vault "backup_$BACKUP_DATE"
```

### 8.2 تخزين البيانات

```javascript
// التخزين المحلي (localStorage)
localStorage.setItem('settings', JSON.stringify(config));

// التخزين السحابي (اختياري)
// Google Drive, Dropbox, GitHub
```

---

## 9️⃣ إعدادات التطوير والإنتاج

### 9.1 بيئة التطوير

```bash
# نمط التطوير
npm run dev

# مع مراقبة التغييرات
npm run dev:watch
```

### 9.2 بيئة الإنتاج

```bash
# بناء للإنتاج
npm run build

# تشغيل على خادم
npm run start
```

---

## 🔟 إعدادات الخوادم والنشر

### 10.1 خادم محلي

```bash
# Python
python -m http.server 8000

# Node.js
http-server -p 8000
```

### 10.2 النشر على الويب

**GitHub Pages:**
```bash
npm run deploy
# ينشر على username.github.io/project
```

**Netlify:**
```bash
# اربط مشروعك مع Netlify
# سيتم النشر التلقائي عند كل تحديث
```

**AWS, Heroku, إلخ:**
اتبع التعليمات الخاصة بكل خدمة

---

## 1️⃣1️⃣ إعدادات متقدمة

### 11.1 ملف الإعدادات (config.json)

```json
{
  "project": {
    "name": "قبو الذكاء الاصطناعي",
    "version": "1.0.0",
    "language": "ar"
  },
  "ui": {
    "theme": "dark",
    "direction": "rtl"
  },
  "performance": {
    "cache": true,
    "lazyLoad": true,
    "compression": true
  },
  "security": {
    "https": true,
    "cors": ["https://example.com"]
  }
}
```

### 11.2 متغيرات البيئة (.env)

```
# لا تشارك هذا الملف!
API_KEY=your-secret-key
DB_CONNECTION=your-connection-string
DEBUG=true
```

---

## 1️⃣2️⃣ استعادة الإعدادات الافتراضية

إذا عدّلت الكثير وأردت العودة:

```bash
# استعادة من Git
git checkout -- .

# أو إعادة تثبيت كاملة
rm -rf node_modules
npm install
```

---

## قائمة فحص الإعدادات

```
☐ تم تخصيص معلومات package.json
☐ تم ضبط ألوان style.css
☐ تم تعيين اللغة إلى العربية (rtl)
☐ تم إعداد categories.md
☐ تم تكوين generate-manifest.js
☐ تم اختبار المشروع محلياً
☐ تم عمل نسخة احتياطية
☐ تم التحقق من الأداء
```

---

## الخطوات التالية

1. **تطبيق الإعدادات**: اختر الإعدادات التي تهمك
2. **الاختبار**: تأكد من أن كل شيء يعمل
3. **النشر**: انشر مشروعك (اختياري)
4. **الصيانة**: حافظ على التحديثات منتظمة

---

**تلميح:** احفظ نسختك من الإعدادات الأصلية قبل التعديل!

---

**آخر تحديث**: 30 أبريل 2026
