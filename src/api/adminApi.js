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

export async function updateUser(id, payload) {
  return apiClient(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id) {
  return apiClient(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}
