import { apiClient } from './apiClient';

// Met à jour une compétence existante
export async function updateUserSkill(skillName, updatedSkill) {
  return apiClient(`/api/user-skills/${encodeURIComponent(skillName)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedSkill),
  });
}

export async function getUserSkills() {
  return apiClient('/api/user-skills');
}

export async function addUserSkill(skill) {
  return apiClient('/api/user-skills', {
    method: 'POST',
     headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skill),
  });
}

export async function deleteUserSkill(skillName) {
  return apiClient(`/api/user-skills/${encodeURIComponent(skillName)}`, {
    method: 'DELETE',
  });
}
