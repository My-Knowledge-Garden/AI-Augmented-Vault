const sidebarToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const logFeed = document.getElementById('log-feed');

const cardConfigs = [
  {
    id: 'card-creative',
    parentMatchers: ['Creative Production', 'الإنتاج الإبداعي']
  },
  {
    id: 'card-radical',
    parentMatchers: ['Radical Discourse', 'الخطاب الراديكالي']
  },
  {
    id: 'card-tech',
    parentMatchers: ['Practical Tech', 'التقنية العملية']
  },
  {
    id: 'card-knowledge',
    parentMatchers: ['Knowledge Management', 'إدارة المعرفة']
  }
];

function showError(message) {
  if (!logFeed) return;
  logFeed.innerHTML = `
    <div class="fetch-error">
      <p>فشل تحميل البيانات: ${message}</p>
    </div>
  `;
}

async function fetchManifest() {
  try {
    const response = await fetch('manifest.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Manifest format غير صالح');
    }
    return data.filter(item => item.public === true || item.public === 'true');
  } catch (error) {
    console.error('fetchManifest error:', error);
    showError(error.message || 'خطأ غير متوقع');
    return [];
  }
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatArabicDate(value) {
  const date = parseDate(value);
  if (!date) return value || 'بدون تاريخ';
  const formatted = new Intl.DateTimeFormat('ar-SA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
  return formatted.replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x0030));
}

function normalizeProgress(value) {
  if (typeof value === 'number') return Math.max(0, Math.min(100, value));
  if (typeof value === 'string') {
    const normalized = Number(value.replace('%', '').trim());
    return Number.isFinite(normalized) ? Math.max(0, Math.min(100, normalized)) : 0;
  }
  return 0;
}

function itemMatchesParent(itemParent, matchers) {
  if (!itemParent || !matchers || !matchers.length) return false;
  return matchers.some(matcher => itemParent.includes(matcher));
}

function updateCards(data) {
  if (!Array.isArray(data) || !data.length) {
    cardConfigs.forEach(config => {
      const card = document.getElementById(config.id);
      if (!card) return;
      const cardDate = card.querySelector('.card-date');
      const progressFill = card.querySelector('.card-progress-fill');
      if (cardDate) cardDate.textContent = 'لا يوجد نشاط مسجل';
      if (progressFill) progressFill.style.width = '0%';
    });
    return;
  }

  cardConfigs.forEach(config => {
    const card = document.getElementById(config.id);
    if (!card) return;

    const cardDate = card.querySelector('.card-date');
    const progressFill = card.querySelector('.card-progress-fill');

    const matchingItems = data.filter(item => itemMatchesParent(item.parent, config.parentMatchers));
    if (!matchingItems.length) {
      if (cardDate) cardDate.textContent = 'لا يوجد نشاط مسجل';
      if (progressFill) progressFill.style.width = '0%';
      return;
    }

    const latestItem = matchingItems.reduce((current, next) => {
      const currentDate = parseDate(current.date);
      const nextDate = parseDate(next.date);
      if (!currentDate) return next;
      if (!nextDate) return current;
      return nextDate > currentDate ? next : current;
    }, matchingItems[0]);

    const averageProgress = Math.round(
      matchingItems.reduce((sum, item) => sum + normalizeProgress(item.progress), 0) / matchingItems.length
    );

    if (cardDate) cardDate.textContent = latestItem.date ? formatArabicDate(latestItem.date) : 'بدون تاريخ';
    if (progressFill) progressFill.style.width = `${averageProgress}%`;
  });
}

function createLogItem(item) {
  const progressValue = normalizeProgress(item.progress);
  const tagsHtml = Array.isArray(item.tags)
    ? item.tags.map(tag => `<span class="log-tag">${tag}</span>`).join('')
    : '';

  return `
    <article class="log-item">
      <div class="log-item-meta">
        <strong class="log-item-title">${item.title || 'بدون عنوان'}</strong>
        <span class="log-category">${item.parent || 'بدون مسار'} › ${item.category || 'بدون فئة'}</span>
      </div>
      <div class="log-progress-small">
        <div class="log-progress-fill" style="width: ${progressValue}%"></div>
      </div>
      <div class="log-markdown">
        <p>${item.description || 'لا يوجد محتوى.'}</p>
      </div>
      <div class="log-tags">${tagsHtml}</div>
      <button class="log-item-open" data-filepath="${item.filePath}">فتح الملف</button>
    </article>
  `;
}

function renderDailyLogs(data) {
  if (!logFeed) return;

  if (!Array.isArray(data) || !data.length) {
    logFeed.innerHTML = '<p class="empty-state">لا توجد سجلات لعرضها.</p>';
    return;
  }

  const sortedItems = [...data].sort((a, b) => {
    const dateA = parseDate(a.date)?.getTime() ?? 0;
    const dateB = parseDate(b.date)?.getTime() ?? 0;
    return dateB - dateA;
  });

  const groups = sortedItems.reduce((acc, item) => {
    const dateKey = formatArabicDate(item.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const groupsHtml = Object.entries(groups).map(([dateLabel, items]) => {
    const itemsHtml = items.map(createLogItem).join('');
    return `
      <section class="daily-group">
        <div class="daily-group-header">
          <h3>${dateLabel}</h3>
        </div>
        ${itemsHtml}
      </section>
    `;
  }).join('');

  logFeed.innerHTML = groupsHtml;

  const openButtons = logFeed.querySelectorAll('.log-item-open');
  openButtons.forEach(button => {
    button.addEventListener('click', event => {
      const target = event.currentTarget;
      const filePath = target.dataset.filepath;
      console.log('فتح الملف:', filePath);
    });
  });
}

function setupSidebarToggle() {
  if (!sidebarToggle || !sidebar) return;
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-open');
  });
}

async function init() {
  setupSidebarToggle();
  const data = await fetchManifest();
  updateCards(data);
  renderDailyLogs(data);
}

init();
