const LIMIT = 200;
const WARN_AT = 180;
const DRAFT_KEY = 'day4-draft';
const THEME_KEY = 'day4-theme';

const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

function safeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
}
function safeRemove(key) {
  try { localStorage.removeItem(key); } catch (e) { /* storage unavailable */ }
}

function updateCounters() {
  const text = noteText.value;
  const chars = text.length;
  const trimmed = text.trim();
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;

  charCount.textContent = chars + ' / ' + LIMIT + ' characters';
  wordCount.textContent = words + (words === 1 ? ' word' : ' words');

  charCount.classList.toggle('warning', chars > WARN_AT && chars <= LIMIT);
  charCount.classList.toggle('over', chars > LIMIT);
}

function clearNote() {
  noteText.value = '';
  updateCounters();
  safeRemove(DRAFT_KEY);
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
}

noteText.addEventListener('input', function () {
  updateCounters();
  safeSet(DRAFT_KEY, noteText.value);
});

noteText.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') clearNote();
});

clearBtn.addEventListener('click', clearNote);

themeToggle.addEventListener('click', function () {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
  safeSet(THEME_KEY, isDark ? 'dark' : 'light');
});

// Restore saved state on load
const savedDraft = safeGet(DRAFT_KEY);
if (savedDraft !== null) noteText.value = savedDraft;
applyTheme(safeGet(THEME_KEY) === 'dark');
updateCounters();