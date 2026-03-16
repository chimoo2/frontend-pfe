import { apiClient } from './apiClient';

export async function getUsers() {
  return apiClient('/admin/users');
}

export async function createUser(payload) {
  return apiClient('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
