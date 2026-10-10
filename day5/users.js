const API_URL = 'https://jsonplaceholder.typicode.com/users';

const filterInput = document.querySelector('#filter-input');
const usersList = document.querySelector('#users-list');
const loading = document.querySelector('#loading');
const errorMessage = document.querySelector('#error-message');

let allUsers = [];

async function loadUsers() {
  loading.hidden = false;
  errorMessage.textContent = '';

  try {
    const response = await fetch(API_URL);

    // fetch only rejects on network failure, so check HTTP errors (404, 500...) ourselves
    if (!response.ok) {
      throw new Error('Server responded with status ' + response.status);
    }

    allUsers = await response.json();
    renderUsers(allUsers);
  } catch (error) {
    errorMessage.textContent = 'Could not load users. Please try again later.';
    console.error('loadUsers failed:', error);
  } finally {
    loading.hidden = true;
  }
}

function renderUsers(list) {
  usersList.textContent = '';

  if (list.length === 0) {
    const empty = document.createElement('li');
    empty.classList.add('no-results');
    empty.textContent = 'No users match your filter.';
    usersList.append(empty);
    return;
  }

  list.forEach(function (user) {
    const li = document.createElement('li');
    li.classList.add('user-card');

    const name = document.createElement('h2');
    name.textContent = user.name;

    const email = document.createElement('p');
    email.textContent = user.email;

    const place = document.createElement('p');
    place.textContent = user.company.name + ' \u2013 ' + user.address.city;

    li.append(name, email, place);
    usersList.append(li);
  });
}

filterInput.addEventListener('input', function () {
  const query = filterInput.value.trim().toLowerCase();

  const filtered = allUsers.filter(function (user) {
    return user.name.toLowerCase().includes(query) ||
           user.username.toLowerCase().includes(query) ||
           user.email.toLowerCase().includes(query);
  });

  renderUsers(filtered);
});

loadUsers();