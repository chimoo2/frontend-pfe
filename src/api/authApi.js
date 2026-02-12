import { BASE_URL } from './apiClient';

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get('content-type') || '';
  const bodyText = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const errMsg = bodyText && typeof bodyText === 'object' ? (bodyText.error || bodyText.message || JSON.stringify(bodyText)) : String(bodyText);
    throw new Error(errMsg || 'Login failed');
  }

  return bodyText;
}

export async function register(payload) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Registration failed');
  }

  return res.json();
}
