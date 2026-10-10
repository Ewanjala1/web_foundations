/**
 * Day 5 Assignment: User Directory API Fetching & Dynamic Filtering
 *
 * Requirements:
 * 1. loadUsers() using fetch, async / await, and try / catch / finally.
 * 2. Store loaded users in an array.
 * 3. renderUsers(list) that renders any array of user objects.
 * 4. Input event listener on filter box to filter users and call renderUsers().
 *    Displays "No users match your filter." when no results match.
 * 5. Handle and test the error path when the URL is broken.
 */

// ============================================================================
// Global State & Constants
// ============================================================================

// API Endpoints: Working URL and broken URL for testing error handling
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const BROKEN_URL = 'https://jsonplaceholder.typicode.com/invalid-users-url-404';

// Active endpoint currently targeted by loadUsers
let currentUrl = API_URL;

// Stored array of users loaded from the API
let users = [];

// DOM Element References
const filterInput = document.getElementById('filter');
const clearFilterBtn = document.getElementById('clear-filter');
const filterCount = document.getElementById('filter-count');
const userListContainer = document.getElementById('user-list');
const loadingSpinner = document.getElementById('loading-spinner');
const errorBanner = document.getElementById('error-banner');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const reloadBtn = document.getElementById('reload-btn');
const testErrorBtn = document.getElementById('test-error-btn');

// ============================================================================
// Helper Utilities
// ============================================================================

/**
 * Extracts initials from a full name (e.g., "Leanne Graham" -> "LG").
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Escapes HTML entities to prevent XSS injection.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// Core Function: loadUsers()
// ============================================================================

/**
 * Fetches user data from the remote API using fetch, async / await,
 * and handles success/failure via try / catch / finally.
 * 
 * @param {string} url - Target API URL (defaults to currentUrl)
 * @returns {Promise<void>}
 */
async function loadUsers(url = currentUrl) {
  // Update state & UI before request
  currentUrl = url;
  loadingSpinner.style.display = 'flex';
  errorBanner.hidden = true;
  userListContainer.innerHTML = '';
  filterCount.textContent = 'Fetching data...';

  try {
    console.log(`[loadUsers] Requesting: ${url}`);
    const response = await fetch(url);

    // Fetch does NOT reject on HTTP 404 / 500 status codes, so we verify response.ok
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText || 'Resource not found'}`);
    }

    const data = await response.json();

    // Store the loaded users in our array
    users = Array.isArray(data) ? data : [];
    console.log(`[loadUsers] Successfully loaded ${users.length} users.`);

    // Reset filter input if already filled
    if (filterInput) {
      filterInput.value = '';
      if (clearFilterBtn) clearFilterBtn.hidden = true;
    }

    // Render the loaded users array
    renderUsers(users);

  } catch (error) {
    console.error('[loadUsers] Error encountered:', error);
    
    // Clear stored users on failure
    users = [];

    // Display user-friendly error message in the UI
    errorBanner.hidden = false;
    errorMessage.textContent = `Unable to fetch users (${error.message}). Please verify the API URL and your internet connection.`;
    filterCount.textContent = 'Error loading users';

    // Show empty error feedback in list container
    userListContainer.innerHTML = `
      <div class="empty-state" role="alert">
        <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 class="empty-title">Error Loading Users</h3>
        <p class="empty-message">${escapeHtml(error.message)}</p>
      </div>
    `;

  } finally {
    // finally block always executes regardless of success or failure
    loadingSpinner.style.display = 'none';
    console.log('[loadUsers] Fetch cycle finished (finally executed).');
  }
}

// ============================================================================
// Core Function: renderUsers(list)
// ============================================================================

/**
 * Draws any array of user objects into the DOM.
 * Displays "No users match your filter." when the list is empty.
 * 
 * @param {Array<Object>} list - Array of user objects to render
 */
function renderUsers(list) {
  // Clear container
  userListContainer.innerHTML = '';

  // Empty state handling: requirement specifically states "No users match your filter."
  if (!Array.isArray(list) || list.length === 0) {
    filterCount.textContent = '0 users found';
    userListContainer.innerHTML = `
      <div class="empty-state" id="no-results">
        <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3 class="empty-title">No users match your filter.</h3>
        <p class="empty-message">We couldn't find any user profiles matching your current filter keywords. Try searching for a different name, handle, or email.</p>
      </div>
    `;
    return;
  }

  // Update counter
  filterCount.textContent = `Showing ${list.length} user${list.length === 1 ? '' : 's'}`;

  // Build card elements for each user
  const fragment = document.createDocumentFragment();

  list.forEach((user) => {
    const card = document.createElement('article');
    card.className = 'user-card';
    card.setAttribute('data-id', user.id);

    const initials = getInitials(user.name);
    const safeName = escapeHtml(user.name);
    const safeUsername = escapeHtml(user.username);
    const safeEmail = escapeHtml(user.email);
    const safePhone = escapeHtml(user.phone);
    const safeWebsite = escapeHtml(user.website);
    const safeCity = escapeHtml(user.address?.city || 'Unknown City');
    const safeStreet = escapeHtml(user.address?.street || '');
    const safeCompany = escapeHtml(user.company?.name || 'Independent');
    const safeCatchPhrase = escapeHtml(user.company?.catchPhrase || '');

    card.innerHTML = `
      <div class="card-top">
        <div class="user-avatar" aria-hidden="true">${initials}</div>
        <div class="user-identity">
          <h2 class="user-name" title="${safeName}">${safeName}</h2>
          <span class="user-handle">@${safeUsername}</span>
        </div>
      </div>

      <div class="card-details">
        <div class="detail-row">
          <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <a href="mailto:${safeEmail}" class="detail-link" title="Send email">${safeEmail}</a>
        </div>

        <div class="detail-row">
          <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <a href="tel:${safePhone}" class="detail-link" title="Call phone">${safePhone}</a>
        </div>

        <div class="detail-row">
          <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <a href="https://${safeWebsite}" target="_blank" rel="noopener noreferrer" class="detail-link" title="Visit website">${safeWebsite}</a>
        </div>

        <div class="detail-row">
          <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span class="detail-text" title="${safeStreet}, ${safeCity}">${safeCity}</span>
        </div>
      </div>

      <div class="card-footer">
        <span class="company-title">Company</span>
        <div class="company-name">${safeCompany}</div>
        ${safeCatchPhrase ? `<p class="company-phrase">&ldquo;${safeCatchPhrase}&rdquo;</p>` : ''}
      </div>
    `;

    fragment.appendChild(card);
  });

  userListContainer.appendChild(fragment);
}

// ============================================================================
// Event Listeners: Filter Box & Controls
// ============================================================================

/**
 * Filter users based on query matching name, username, email, city, or company.
 */
function applyFilter() {
  const query = (filterInput.value || '').toLowerCase().trim();
  
  // Show / hide the quick clear button
  if (clearFilterBtn) {
    clearFilterBtn.hidden = query.length === 0;
  }

  // If query is empty, render the complete stored array
  if (query === '') {
    renderUsers(users);
    return;
  }

  // Filter the stored array
  const filtered = users.filter((user) => {
    const name = (user.name || '').toLowerCase();
    const username = (user.username || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const city = (user.address?.city || '').toLowerCase();
    const company = (user.company?.name || '').toLowerCase();

    return name.includes(query) ||
           username.includes(query) ||
           email.includes(query) ||
           city.includes(query) ||
           company.includes(query);
  });

  // Call renderUsers with the result (shows "No users match your filter." if empty)
  renderUsers(filtered);
}

// Listen for the input event on the filter box
if (filterInput) {
  filterInput.addEventListener('input', applyFilter);
}

// Clear filter button
if (clearFilterBtn) {
  clearFilterBtn.addEventListener('click', () => {
    filterInput.value = '';
    filterInput.focus();
    applyFilter();
  });
}

// Reload from standard API endpoint
if (reloadBtn) {
  reloadBtn.addEventListener('click', () => {
    loadUsers(API_URL);
  });
}

// Retry button in error banner
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    loadUsers(API_URL);
  });
}

// Interactive button to test the error path by breaking the URL
if (testErrorBtn) {
  testErrorBtn.addEventListener('click', () => {
    console.log('[Test Error Path] Intentionally requesting broken endpoint...');
    loadUsers(BROKEN_URL);
  });
}

// ============================================================================
// Initialization
// ============================================================================

// Kick off user loading as soon as DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadUsers(API_URL);
});
