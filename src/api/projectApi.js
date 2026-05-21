import { apiClient } from './apiClient';

export async function getAllProjects() {
  try {
    return await apiClient('/api/projects');
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getProjectsByManager(managerEmail) {
  try {
    return await apiClient(`/api/projects/manager/${encodeURIComponent(managerEmail)}`);
  } catch (error) {
    console.error(`Error fetching projects for manager ${managerEmail}:`, error);
    throw error;
  }
}

export async function getProjectById(id) {
  try {
    return await apiClient(`/api/projects/${id}`);
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
}

export async function createProject(projectData) {
  try {
    return await apiClient('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProject(id, projectData) {
  try {
    return await apiClient(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
}

export async function deleteProject(id) {
  try {
    return await apiClient(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
}

export async function getMatchingCandidates(projectId) {
  try {
    return await apiClient(`/api/projects/${projectId}/matching`);
  } catch (error) {
    console.error(`Error getting matching candidates for project ${projectId}:`, error);
    throw error;
  }
}

export async function getMatchingHistory(projectId) {
  try {
    return await apiClient(`/api/projects/${projectId}/matching/history`);
  } catch (error) {
    console.error(`Error getting matching history for project ${projectId}:`, error);
    throw error;
  }
}

export async function getLatestMatching(projectId) {
  try {
    return await apiClient(`/api/projects/${projectId}/matching/latest`);
  } catch (error) {
    console.error(`Error getting latest matching for project ${projectId}:`, error);
    throw error;
  }
}

export async function getAllEmployees() {
  try {
    return await apiClient('/api/projects/employees');
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

export async function assignEmployeeToProject(projectId, employeeId) {
  try {
    return await apiClient(`/api/projects/${projectId}/assign/${encodeURIComponent(employeeId)}`, {
      method: 'POST',
    });
  } catch (error) {
    console.error(`Error assigning employee ${employeeId} to project ${projectId}:`, error);
    throw error;
  }
}

export async function getAssignedProjectsForUser(userId) {
  try {
    return await apiClient(`/api/projects/assigned/user/${userId}`);
  } catch (error) {
    console.error(`Error fetching assigned projects for user ${userId}:`, error);
    throw error;
  }
}

export async function getEmployeeNotifications(userId) {
  try {
    return await apiClient(`/api/projects/notifications/user/${userId}`);
  } catch (error) {
    console.error(`Error fetching employee notifications for user ${userId}:`, error);
    throw error;
  }
}
