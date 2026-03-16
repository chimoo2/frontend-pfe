// simple utility functions to keep track of projects that have been opened for matching

export function getMatchedProjects() {
  try {
    const stored = JSON.parse(localStorage.getItem('matchedProjects') || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (e) {
    console.warn('failed to read matchedProjects from localStorage', e);
    return [];
  }
}

export function markProjectMatched(id) {
  try {
    const existing = getMatchedProjects();
    if (!existing.includes(id)) {
      existing.push(id);
      localStorage.setItem('matchedProjects', JSON.stringify(existing));
    }
  } catch (e) {
    console.warn('failed to write matchedProjects to localStorage', e);
  }
}
