import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');

if (projects && projectsContainer) {
  // ✅ Render the projects after they're loaded
  renderProjects(projects, projectsContainer, 'h2');

  // ✅ Update the title dynamically
  if (titleElement) {
    const count = Array.isArray(projects) ? projects.length : 1;
    titleElement.textContent = `Projects (${count})`;
  }
} else {
  console.warn('Projects data or container not found.');
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
