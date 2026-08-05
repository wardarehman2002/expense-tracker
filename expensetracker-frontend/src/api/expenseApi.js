// src/api/expenseApi.js
// The only file in the frontend allowed to call fetch(). Components import
// these functions instead of calling fetch directly.

// VITE_API_URL can be set when deploying (e.g. Vercel) to point at the
// deployed backend. Falls back to local dev.
const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/expenses`;

async function handleResponse(response) {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || 'Something went wrong');
  }
  return body;
}

/**
 * Builds a query string from a filters object, skipping empty values.
 */
function buildQueryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function getAllExpenses(filters = {}) {
  const response = await fetch(`${BASE_URL}${buildQueryString(filters)}`);
  return handleResponse(response);
}

export async function getStats() {
  const response = await fetch(`${BASE_URL}/stats`);
  return handleResponse(response);
}

export async function createExpense(data) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateExpense(id, data) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteExpense(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
