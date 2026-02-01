// DOM Elements
const domainInput = document.getElementById('domain');
const useDateFilterCheckbox = document.getElementById('useDateFilter');
const dateRangeSection = document.getElementById('dateRange');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const previewSection = document.getElementById('previewSection');
const previewCount = document.getElementById('previewCount');
const previewList = document.getElementById('previewList');
const previewBtn = document.getElementById('previewBtn');
const deleteBtn = document.getElementById('deleteBtn');
const statusDiv = document.getElementById('status');
const siteButtons = document.querySelectorAll('.site-btn');

// State
let foundItems = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set default dates
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  endDateInput.value = formatDate(today);
  startDateInput.value = formatDate(lastMonth);

  // Load saved domain from storage
  chrome.storage.local.get(['lastDomain'], (result) => {
    if (result.lastDomain) {
      domainInput.value = result.lastDomain;
      updateActiveButton(result.lastDomain);
    }
  });
});

// Event Listeners
useDateFilterCheckbox.addEventListener('change', (e) => {
  dateRangeSection.classList.toggle('hidden', !e.target.checked);
  hideStatus();
  hidePreview();
});

domainInput.addEventListener('input', () => {
  hideStatus();
  hidePreview();
  deleteBtn.disabled = true;
  updateActiveButton(domainInput.value.trim());
});

// Site button click handlers
siteButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const domain = btn.dataset.domain;
    domainInput.value = domain;
    updateActiveButton(domain);
    hideStatus();
    hidePreview();
    deleteBtn.disabled = true;
  });
});

// Update active button state
function updateActiveButton(domain) {
  const normalizedDomain = normalizeDomain(domain);
  siteButtons.forEach(btn => {
    const btnDomain = btn.dataset.domain;
    if (matchesDomain(normalizedDomain, btnDomain)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

previewBtn.addEventListener('click', handlePreview);
deleteBtn.addEventListener('click', handleDelete);

// Handle Preview
async function handlePreview() {
  const domain = domainInput.value.trim();

  if (!domain) {
    showStatus('error', 'Lütfen bir site adresi girin');
    return;
  }

  // Save domain for next time
  chrome.storage.local.set({ lastDomain: domain });

  // Normalize domain
  const normalizedDomain = normalizeDomain(domain);

  previewBtn.classList.add('loading');
  hideStatus();

  try {
    // Search the entire history by default (Chrome only searches the last 24 hours without startTime)
    let startTime = 0;
    let endTime = Date.now();

    // Add date filter if enabled
    if (useDateFilterCheckbox.checked && startDateInput.value) {
      // "T00:00:00" makes the date local time (a date-only string is parsed as UTC)
      const startDate = new Date(`${startDateInput.value}T00:00:00`);
      startDate.setHours(0, 0, 0, 0);
      startTime = startDate.getTime();

      if (endDateInput.value) {
        const endDate = new Date(`${endDateInput.value}T00:00:00`);
        endDate.setHours(23, 59, 59, 999);
        endTime = endDate.getTime();
      }
    }

    // Search history
    const results = await searchHistory(normalizedDomain, startTime, endTime);

    // Filter results to match domain exactly
    foundItems = results.filter(item => {
      try {
        const url = new URL(item.url);
        const itemDomain = url.hostname.replace(/^www\./, '');
        return matchesDomain(itemDomain, normalizedDomain);
      } catch {
        return false;
      }
    });

    // Show preview
    showPreview(foundItems);

    // Enable delete button if items found
    deleteBtn.disabled = foundItems.length === 0;

    if (foundItems.length === 0) {
      showStatus('warning', 'Bu site için geçmiş bulunamadı');
    }

  } catch (error) {
    showStatus('error', 'Arama sırasında hata oluştu');
    console.error(error);
  } finally {
    previewBtn.classList.remove('loading');
  }
}

// Search history without a silent result limit:
// if a time range hits MAX_RESULTS, split it in half and search both halves
const MAX_RESULTS = 10000;

async function searchHistory(text, startTime, endTime) {
  const results = await chrome.history.search({ text, startTime, endTime, maxResults: MAX_RESULTS });

  if (results.length < MAX_RESULTS || endTime - startTime <= 1) {
    return results;
  }

  const middle = Math.floor((startTime + endTime) / 2);
  const [newer, older] = await Promise.all([
    searchHistory(text, middle, endTime),
    searchHistory(text, startTime, middle)
  ]);

  // A URL visited in both halves is returned twice
  const seenUrls = new Set(newer.map(item => item.url));
  return newer.concat(older.filter(item => !seenUrls.has(item.url)));
}

// Handle Delete
async function handleDelete() {
  if (foundItems.length === 0) return;

  deleteBtn.classList.add('loading');
  hideStatus();

  try {
    // Delete each URL from history
    const deletePromises = foundItems.map(item =>
      chrome.history.deleteUrl({ url: item.url })
    );

    await Promise.all(deletePromises);

    const count = foundItems.length;
    foundItems = [];

    hidePreview();
    deleteBtn.disabled = true;

    showStatus('success', `${count} kayıt başarıyla silindi`);

  } catch (error) {
    showStatus('error', 'Silme işlemi sırasında hata oluştu');
    console.error(error);
  } finally {
    deleteBtn.classList.remove('loading');
  }
}

// Show Preview
function showPreview(items) {
  previewSection.classList.remove('hidden');
  previewCount.textContent = `${items.length} kayıt bulundu`;
  previewList.textContent = '';

  if (items.length === 0) {
    previewList.appendChild(createElement('div', 'preview-empty', 'Kayıt bulunamadı'));
    return;
  }

  // Show only first 50 items in preview (built with textContent, so titles/URLs are never parsed as HTML)
  items.slice(0, 50).forEach(item => {
    const date = new Date(item.lastVisitTime);
    const title = createElement('span', 'preview-item-title', item.title || extractDomain(item.url));
    title.title = item.url;

    const row = createElement('div', 'preview-item');
    row.append(title, createElement('span', 'preview-item-date', formatDisplayDate(date)));
    previewList.appendChild(row);
  });

  if (items.length > 50) {
    const more = createElement('div', 'preview-item', `... ve ${items.length - 50} kayıt daha`);
    more.style.justifyContent = 'center';
    more.style.color = 'var(--text-muted)';
    previewList.appendChild(more);
  }
}

// Hide Preview
function hidePreview() {
  previewSection.classList.add('hidden');
  previewList.textContent = '';
  foundItems = [];
}

// Show Status
function showStatus(type, message) {
  statusDiv.className = `status ${type}`;
  statusDiv.querySelector('.status-text').textContent = message;
  statusDiv.classList.remove('hidden');
}

// Hide Status
function hideStatus() {
  statusDiv.classList.add('hidden');
}

// Utility Functions
function normalizeDomain(domain) {
  // Remove protocol, www, port, path, query and hash
  return domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[/?#:].*$/, '');
}

// Exact domain or one of its subdomains (m.youtube.com matches youtube.com, notyoutube.com does not)
function matchesDomain(hostname, domain) {
  return hostname !== '' && domain !== '' && (hostname === domain || hostname.endsWith('.' + domain));
}

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function formatDate(date) {
  // Local date for <input type="date"> (toISOString uses UTC and can give the previous day)
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function createElement(tag, className, text = '') {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}
