const emitted = new Set();

const ITEM_SELECTOR = '.jin-flash-item.flash.is-important';
const TITLE_SELECTOR = '.right-common-title';
const BODY_SELECTOR = '.flash-text';

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function toSpeechText(itemEl) {
  const title = normalize(itemEl.querySelector(TITLE_SELECTOR)?.textContent || '');
  const body = normalize(itemEl.querySelector(BODY_SELECTOR)?.textContent || '');

  if (title && body && body.startsWith(title)) return body;
  if (title && body) return `${title}。${body}`;
  return body || title;
}

function isValidChineseNews(text) {
  if (!text) return false;
  if (text.length < 8 || text.length > 300) return false;
  return /[\u4e00-\u9fa5]/.test(text);
}

function sendNews(text) {
  chrome.runtime.sendMessage({ type: 'JIN10_FLASH', text }, () => void chrome.runtime.lastError);
}

function processImportantItem(itemEl) {
  if (!(itemEl instanceof HTMLElement)) return;
  if (!itemEl.matches(ITEM_SELECTOR)) return;

  const text = toSpeechText(itemEl);
  if (!isValidChineseNews(text)) return;

  const id = itemEl.closest('.jin-flash-item-container')?.id || '';
  const fp = `${id}::${text.slice(0, 160)}`;
  if (emitted.has(fp)) return;

  emitted.add(fp);
  sendNews(text);
}

function findImportantItems(node) {
  if (!(node instanceof HTMLElement)) return [];

  const items = [];
  if (node.matches(ITEM_SELECTOR)) items.push(node);
  items.push(...node.querySelectorAll(ITEM_SELECTOR));
  return items;
}

function boot() {
  // 只播报后续新增节点，不扫描页面历史内容。
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        findImportantItems(node).forEach((item) => processImportantItem(item));
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
