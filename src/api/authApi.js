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
  const res = await fetch(`${BASE_URL}/auth/register-public`, {
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

export async function forgotPassword(email) {
  const res = await fetch(`${BASE_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`, {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Forgot password failed');
  }

  return res.text();
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Reset password failed');
  }

  return res.text();
}

export async function changePassword(oldPassword, newPassword, confirmPassword) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
  });

  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const errMsg = body && typeof body === 'object' ? (body.error || body.message || JSON.stringify(body)) : String(body);
    throw new Error(errMsg || 'Change password failed');
  }

  return body;
}

