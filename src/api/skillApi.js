import { apiClient } from './apiClient';

/**
 * Skill API client
 * Provides methods to fetch skills by family, domain, etc.
 */

export async function getFamilies() {
  try {
    return await apiClient('/api/skills/families');
  } catch (error) {
    console.error('Error fetching skill families:', error);
    throw error;
  }
}

export async function getDomains() {
  try {
    return await apiClient('/api/skills/domains');
  } catch (error) {
    console.error('Error fetching skill domains:', error);
    throw error;
  }
}

export async function getSkillsByFamily(family) {
  try {
    return await apiClient(`/api/skills?family=${encodeURIComponent(family)}`);
  } catch (error) {
    console.error(`Error fetching skills for family ${family}:`, error);
    throw error;
  }
}

export async function getSkillsByDomain(domain) {
  try {
    return await apiClient(`/api/skills?domain=${encodeURIComponent(domain)}`);
  } catch (error) {
    console.error(`Error fetching skills for domain ${domain}:`, error);
    throw error;
  }
}

export async function getSkillsByFamilies(families) {
  try {
    const familiesParam = families.join(',');
    return await apiClient(`/api/skills/batch?families=${encodeURIComponent(familiesParam)}`);
  } catch (error) {
    console.error('Error fetching skills for multiple families:', error);
    throw error;
  }
}

export async function getSkillByName(skillName) {
  try {
    return await apiClient(`/api/skills/${encodeURIComponent(skillName)}`);
  } catch (error) {
    console.error(`Error fetching skill ${skillName}:`, error);
    throw error;
  }
}

export async function searchSkillsByType(type) {
  try {
    return await apiClient(`/api/skills/search?type=${encodeURIComponent(type)}`);
  } catch (error) {
    console.error(`Error searching skills by type ${type}:`, error);
    throw error;
  }
}
