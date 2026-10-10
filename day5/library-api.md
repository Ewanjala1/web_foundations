# Library API Notes: Fetching Users

## Overview

- The page loads a list of users from the public JSONPlaceholder API.
- Requests are made with the browser's built-in `fetch()` function.
- No API key or login is needed.

## Endpoint

- URL: `https://jsonplaceholder.typicode.com/users`
- Method: `GET`
- Response: a JSON array of 10 user objects

## User fields used

- `name`: the person's full name
- `username`: used for filtering
- `email`: shown on the card and used for filtering
- `company.name`: shown on the card
- `address.city`: shown on the card

## Functions in `users.js`

### `loadUsers()`

- `async` function that requests the data with `await fetch(API_URL)`
- Checks `response.ok` and throws an error for HTTP failures such as 404 or 500
- Stores the parsed result in the `allUsers` array
- `try` runs the request, `catch` shows an error message, `finally` hides the loading text

### `renderUsers(list)`

- Clears the list, then draws one card per user in `list`
- Works with any array, so it is used for both the full list and filtered lists
- Uses `createElement` and `textContent` (never `innerHTML`)
- Shows "No users match your filter." when `list` is empty

### Filter listener

- Runs on every `input` event of `#filter-input`
- Filters `allUsers` by name, username or email, ignoring upper and lower case
- Passes the result to `renderUsers()`

## Error handling

- `fetch` only rejects when the network fails, so `response.ok` is checked manually
- Any failure shows "Could not load users. Please try again later." in `#error-message`
- The technical error is written to the console for debugging

## Testing the error path

- Temporarily change `API_URL` to a broken address, for example `.../userz`
- Reload the page: the loading text disappears and the error message appears
- Restore the correct URL afterwards
