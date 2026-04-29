const sidebarToggle = document.getElementById('menu-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const sidebar = document.getElementById('sidebar');
const logFeed = document.getElementById('log-feed');
const weeklySummary = document.getElementById('weekly-summary');

const dashboardGrid = document.querySelector('.dashboard-grid');

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

let appState = {
  allData: [],
  currentFilter: null,
  filterLabel: null
};

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

function calculateWeeklyStats(data) {
  if (!Array.isArray(data) || !data.length) {
    return { total: 0, distribution: {}, topParent: null, topPercentage: 0 };
  }

  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6);

  const weeklyItems = data.filter(item => {
    const itemDate = parseDate(item.date);
    return itemDate && itemDate.getTime() >= startDate.getTime() && itemDate.getTime() <= endDate.getTime();
  });

  const distribution = weeklyItems.reduce((acc, item) => {
    const parent = item.parent || 'غير مصنف';
    acc[parent] = (acc[parent] || 0) + 1;
    return acc;
  }, {});

  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const sortedParents = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
  const topParent = sortedParents.length ? sortedParents[0][0] : null;
  const topPercentage = total ? Math.round((sortedParents[0][1] / total) * 100) : 0;
  const percentDistribution = {};

  Object.entries(distribution).forEach(([parent, count]) => {
    percentDistribution[parent] = {
      count,
      percentage: total ? Math.round((count / total) * 100) : 0
    };
  });

  return {
    total,
    distribution: percentDistribution,
    topParent,
    topPercentage
  };
}

function renderWeeklySummary(stats) {
  if (!weeklySummary) return;

  if (!stats || !stats.total) {
    weeklySummary.innerHTML = `
      <div class="summary-card empty-summary">
        <h2>حصيلة الأسبوع</h2>
        <p>لا توجد نشاطات خلال الأيام السبعة الماضية.</p>
      </div>
    `;
    return;
  }

  const barsHtml = Object.entries(stats.distribution).map(([parent, info]) => {
    return `
      <div class="summary-row">
        <div class="summary-row-header">
          <span class="summary-parent">${stripEnglishLabel(parent)}</span>
          <span class="summary-count">${info.count}</span>
        </div>
        <div class="summary-bar">
          <div class="summary-bar-fill" style="width: ${info.percentage}%;"></div>
        </div>
      </div>
    `;
  }).join('');

  weeklySummary.innerHTML = `
    <div class="summary-card">
      <div class="summary-title">
        <h2>حصيلة الأسبوع</h2>
      </div>
      <p class="summary-text">هذا الأسبوع، تركز نشاطك الأكبر على ${stripEnglishLabel(stats.topParent)} بنسبة ${stats.topPercentage}%.</p>
      <div class="summary-bars">
        ${barsHtml}
      </div>
    </div>
  `;
}

function setupSidebarToggle() {
  if (!sidebarToggle || !sidebar) return;
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-open');
  });
}

function setupSidebarClose() {
  if (!sidebarClose || !sidebar) return;
  sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('sidebar-open');
  });
}

function buildTree(data) {
  const tree = {};
  data.forEach(item => {
    const parent = item.parent || 'غير مصنف';
    const category = item.category || 'غير محدد';
    if (!tree[parent]) tree[parent] = {};
    if (!tree[category]) tree[parent][category] = [];
    tree[parent][category].push({
      title: item.title,
      filePath: item.filePath,
      progress: item.progress,
      parent: item.parent,
      category: item.category,
      ...item
    });
  });
  return tree;
}

function stripEnglishLabel(value) {
  if (typeof value !== 'string') return value;
  const arabicSegments = value.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9\s]+/g);
  if (arabicSegments) {
    const joined = arabicSegments.join('').trim();
    if (joined.length) return joined;
  }
  const match = value.match(/\(([^)]+)\)$/);
  if (match && match[1]) return match[1].trim();
  return value;
}

function renderAccordion(tree) {
  const container = document.getElementById('accordion-container');
  if (!container) return;
  container.innerHTML = '';
  Object.entries(tree).forEach(([parent, categories]) => {
    const parentDetails = document.createElement('details');
    parentDetails.className = 'accordion-parent';
    const parentSummary = document.createElement('summary');
    parentSummary.className = 'accordion-summary-1';
    parentSummary.textContent = stripEnglishLabel(parent);
    parentDetails.appendChild(parentSummary);
    Object.entries(categories).forEach(([category, items]) => {
      const categoryDetails = document.createElement('details');
      categoryDetails.className = 'accordion-category';
      const categorySummary = document.createElement('summary');
      categorySummary.className = 'accordion-summary-2';
      categorySummary.textContent = stripEnglishLabel(category);
      categoryDetails.appendChild(categorySummary);
      items.forEach(item => {
        const itemBtn = document.createElement('button');
        itemBtn.className = 'accordion-item';
        itemBtn.textContent = stripEnglishLabel(item.title);
        itemBtn.dataset.parent = item.parent;
        itemBtn.dataset.category = item.category;
        itemBtn.addEventListener('click', () => {
          filterDashboard({
            parent: item.parent,
            category: item.category
          });
        });
        categoryDetails.appendChild(itemBtn);
      });
      parentDetails.appendChild(categoryDetails);
    });
    container.appendChild(parentDetails);
  });
}

function filterDashboard(path) {
  if (!path || !path.parent || !path.category) return;
  const filtered = appState.allData.filter(item =>
    item.parent === path.parent && item.category === path.category
  );
  appState.currentFilter = path;
  appState.filterLabel = `${stripEnglishLabel(path.parent)} › ${stripEnglishLabel(path.category)}`;
  if (dashboardGrid) dashboardGrid.style.display = 'none';
  if (weeklySummary) weeklySummary.style.display = 'none';
  const filterIndicator = document.getElementById('filter-indicator');
  if (filterIndicator) {
    filterIndicator.style.display = 'block';
    filterIndicator.textContent = `عرض سجلات: ${appState.filterLabel}`;
  }
  const showAllBtn = document.getElementById('showAllBtn');
  if (showAllBtn) showAllBtn.style.display = 'inline-block';
  renderDailyLogs(filtered);
  if (sidebar) sidebar.classList.remove('sidebar-open');
}

function resetFilter() {
  appState.currentFilter = null;
  appState.filterLabel = null;
  if (dashboardGrid) dashboardGrid.style.display = 'grid';
  if (weeklySummary) weeklySummary.style.display = 'block';
  const filterIndicator = document.getElementById('filter-indicator');
  if (filterIndicator) filterIndicator.style.display = 'none';
  const showAllBtn = document.getElementById('showAllBtn');
  if (showAllBtn) showAllBtn.style.display = 'none';
  renderDailyLogs(appState.allData);
}

async function init() {
  setupSidebarToggle();
  setupSidebarClose();
  const data = await fetchManifest();
  appState.allData = data;
  updateCards(data);
  const stats = calculateWeeklyStats(data);
  renderWeeklySummary(stats);
  renderDailyLogs(data);
  const tree = buildTree(data);
  renderAccordion(tree);
  const showAllBtn = document.getElementById('showAllBtn');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', resetFilter);
  }
}

init();
