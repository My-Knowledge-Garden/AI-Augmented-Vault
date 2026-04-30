# دليل التثبيت الشامل

## خطوات تثبيت مشروع قبو الذكاء الاصطناعي المعزز

هذا الدليل يساعدك خطوة بخطوة لتثبيت المشروع بنجاح على نظامك.

---

## الخطوة 1: تحضير جهازك

### 1.1 تحقق من المتطلبات
أولاً، تأكد من توفر جميع المتطلبات:
- نظام تشغيل محدث (انظر `requirements.md`)
- متصفح ويب حديث
- محرر نصوص (يفضل VS Code)

### 1.2 التحقق من Node.js (اختياري لكن موصى به)

افتح Terminal/Command Prompt وتحقق:

**على Windows:**
```cmd
node --version
npm --version
```

**على macOS/Linux:**
```bash
node --version
npm --version
```

يجب أن ترى رقم نسخة مثل `v14.0.0` أو أحدث.

إذا لم تكن مثبتاً، انزل Node.js من: https://nodejs.org/

### 1.3 التحقق من Git (اختياري لكن موصى به)

```bash
git --version
```

إذا لم تكن مثبتاً، انزل Git من: https://git-scm.com/

---

## الخطوة 2: الحصول على المشروع

اختر إحدى الطرق التالية:

### الطريقة أ: استخدام Git (الموصى بها)

فتح Terminal/Command Prompt في المجلد الذي تريد تثبيت المشروع فيه:

```bash
# انسخ المشروع
git clone https://github.com/My-Knowledge-Garden/AI-Augmented-Vault.git

# انتقل إلى مجلد المشروع
cd AI-Augmented-Vault
```

**الفوائد:**
- ✅ تحديثات سهلة مستقبلاً (`git pull`)
- ✅ تتبع التغييرات
- ✅ المرونة في الإصدارات

### الطريقة ب: تنزيل ZIP (بسيطة)

1. انتقل إلى: https://github.com/My-Knowledge-Garden/AI-Augmented-Vault
2. انقر على **Code** ثم **Download ZIP**
3. استخرج الملف في مجلد من اختيارك
4. افتح Terminal/Command Prompt في المجلد المستخرج

```bash
cd AI-Augmented-Vault
```

**الملاحظة:** لن تحصل على تحديثات تلقائية

---

## الخطوة 3: تثبيت المكتبات

### 3.1 تثبيت المتعلقات (Dependencies)

من داخل مجلد `AI-Augmented-Vault`:

```bash
# تثبيت جميع المكتبات المطلوبة
npm install
```

سيستغرق هذا بضع دقائق. ستظهر رسائل مختلفة، وفي النهاية ستكون جاهزاً.

**ماذا يحدث:**
- تنزيل المكتبة `gray-matter` (لقراءة Markdown)
- إنشاء مجلد `node_modules/`
- تحديث ملف `package-lock.json`

### 3.2 التحقق من التثبيت

```bash
# تحقق من أن gray-matter مثبت
npm list gray-matter
```

يجب أن ترى: `gray-matter@4.0.3` أو نسخة أحدث

---

## الخطوة 4: اختبر المشروع

### 4.1 إنشاء ملف Manifest (اختياري)

```bash
# شغّل سكريبت إنشاء البيانات الوصفية
node generate-manifest.js
```

**النتيجة المتوقعة:**
- إنشاء ملف `manifest.json` جديد
- ستظهر رسالة نجاح في Terminal

### 4.2 افتح الواجهة في المتصفح

1. انتقل إلى مجلد المشروع
2. افتح الملف `index.html` بالنقر المزدوج عليه
3. أو افتحه يدويًا في المتصفح بـ `Ctrl+O` (Windows/Linux) أو `Cmd+O` (Mac)

**يجب أن ترى:**
- صفحة ويب تفاعلية
- قائمة بالمحتوى والفئات
- واجهة للبحث والملاحة

---

## الخطوة 5: الإعدادات الأولية

### 5.1 إنشاء نسختك الخاصة (اختياري)

إذا أردت مساهمة أو تعديلات:

```bash
# أنشئ فرع جديد (Branch)
git checkout -b my-changes

# أو انسخ المشروع لحسابك على GitHub:
# 1. اذهب إلى https://github.com/My-Knowledge-Garden/AI-Augmented-Vault
# 2. انقر على "Fork" في الأعلى
# 3. استنسخ نسختك الخاصة
```

### 5.2 اختياري: إعداد محرر VS Code

إذا كنت تستخدم VS Code:

1. افتح المشروع:
   ```bash
   code .
   ```

2. ثبّت المميزات الموصى بها:
   - Markdown All in One
   - Prettier - Code formatter
   - Better Comments

---

## الخطوة 6: استكشاف المحتوى

الآن أنت جاهز! 🎉

### 6.1 الملفات الرئيسية

```
AI-Augmented-Vault/
├── index.html          ← افتح هذا في المتصفح
├── script.js           ← منطق الواجهة
├── style.css           ← تنسيق الواجهة
├── package.json        ← قائمة المكتبات
├── categories.md       ← قائمة المحتويات
├── generate-manifest.js ← أداة إنشاء البيانات الوصفية
├── build_vault.py      ← أداة بناء القبو
├── manifest.json       ← البيانات الوصفية المولدة
└── AI-Augmented-Vault/ ← مجلد المحتوى الرئيسي
    ├── 1-creative-production/
    ├── 2-radical-discourse/
    ├── 3-practical-tech/
    └── 4-knowledge-management/
```

### 6.2 الخطوات التالية

1. اقرأ `categories.md` لفهم البنية
2. افتح `index.html` لاستكشاف المحتوى
3. اقرأ `README.md` للمزيد من التفاصيل
4. ابدأ باستكشاف الفئات التي تهمك

---

## نصائح للعمل اليومي

### 💡 نصيحة 1: اختصارات سريعة

```bash
# تشغيل سريع لمولد البيانات الوصفية
npm start  # (إذا تم تكوينه)

# أو مباشرة:
node generate-manifest.js
```

### 💡 نصيحة 2: تحديث المشروع

إذا كان لديك نسخة من Git:

```bash
# احصل على آخر التحديثات
git pull origin main

# ثم أعد تثبيت المكتبات (في حالة التغييرات)
npm install
```

### 💡 نصيحة 3: حل المشاكل الشائعة

**مشكلة: رسالة خطأ عند `npm install`**
- جرّب: `npm cache clean --force` ثم `npm install` مجدداً

**مشكلة: `manifest.json` لا ينُشأ**
- تحقق: `node generate-manifest.js` مجدداً
- تحقق من أذونات الكتابة في المجلد

**مشكلة: `index.html` لا يفتح**
- تأكد من فتح الملف بـ `file://` في المتصفح
- جرّب متصفح مختلف

---

## خادم محلي (متقدم - اختياري)

إذا أردت تشغيل خادم محلي:

### استخدام Python

```bash
# Python 3
python -m http.server 8000

# ثم افتح في المتصفح:
# http://localhost:8000
```

### استخدام Node.js

```bash
# ثبّت http-server عالمياً
npm install -g http-server

# شغّله
http-server

# ثم افتح في المتصفح:
# http://localhost:8080
```

---

## تثبيت متقدم: من الصفر

إذا واجهت مشاكل، حاول هذا:

```bash
# حذف كل شيء وابدأ من جديد
rm -rf node_modules package-lock.json

# إعادة التثبيت من الصفر
npm install

# التحقق
npm list
```

---

## قائمة التحقق بعد التثبيت

```
☐ تم استنساخ أو تنزيل المشروع
☐ تم تثبيت npm install
☐ تم التحقق من npm list gray-matter
☐ تم تشغيل generate-manifest.js بنجاح
☐ تم فتح index.html في المتصفح
☐ تظهر الواجهة والمحتوى بشكل صحيح
☐ يمكنك التنقل بين الفئات
☐ لا توجد رسائل خطأ في console المتصفح
```

---

## الخطوات التالية

بعد التثبيت الناجح:

1. ✅ اقرأ `quick-start.md` للبدء السريع
2. ✅ استكشف `categories.md`
3. ✅ اقرأ `best-practices.md` للنصائح
4. ✅ ابدأ باستكشاف المحتوى الذي يهمك

---

## الدعم والمساعدة

إذا واجهت مشاكل:

1. **تحقق من** `troubleshooting.md`
2. **راجع** `requirements.md`
3. **ابحث عن المشكلة** على GitHub Issues
4. **تواصل مع المجتمع** عبر GitHub

---

**تهانينا! تم التثبيت بنجاح! 🎉**

---

**آخر تحديث**: 30 أبريل 2026
