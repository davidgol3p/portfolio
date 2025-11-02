import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// === Load data and DOM elements ===
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// === Global state ===
let query = '';
let selectedIndex = -1;
let currentPieData = []; // keep track of pie chart data for filtering by year

/* ------------------------------------------------
   ✅ HELPER FUNCTION: apply both filters together
------------------------------------------------ */
function getFilteredProjects() {
  let filtered = projects;

  // Apply search filter
  if (query) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.year.toLowerCase().includes(query)
    );
  }

  // Apply pie chart filter (year)
  if (selectedIndex !== -1 && currentPieData.length > 0) {
    const selectedYear = currentPieData[selectedIndex].label;
    filtered = filtered.filter(p => p.year === selectedYear);
  }

  return filtered;
}

/* ------------------------------------------------
   ✅ MAIN FUNCTION: render pie chart & legend
------------------------------------------------ */
function renderPieChart(projectsGiven) {
  let svg = d3.select('svg');
  svg.selectAll('*').remove();
  let legend = d3.select('.legend');
  legend.selectAll('*').remove();

  // Compute year frequencies
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  // Save this for later filtering
  currentPieData = data;

  // Generate pie chart arcs
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  // === Draw pie slices ===
  arcs.forEach((arc, idx) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .attr('class', 'pie-slice')
      .on('click', () => {
        // Toggle selection
        selectedIndex = selectedIndex === idx ? -1 : idx;
        updateSelection();
      });
  });

  // === Draw legend ===
  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        updateSelection();
      });
  });

  /* --------------------------------------------
     ✅ FUNCTION: visually update selected slice
     + trigger re-filtering
  -------------------------------------------- */
  function updateSelection() {
    // highlight selected wedge and legend
    svg.selectAll('path').attr('class', (_, i) =>
      i === selectedIndex ? 'pie-slice selected' : 'pie-slice'
    );
    legend.selectAll('li').attr('class', (_, i) =>
      i === selectedIndex ? 'legend-item selected' : 'legend-item'
    );

    // filter and re-render projects
    const filtered = getFilteredProjects();
    renderProjects(filtered, projectsContainer, 'h2');

    // update title count
    if (titleElement) {
      titleElement.textContent = `Projects (${filtered.length})`;
    }
  }
}

/* ------------------------------------------------
   ✅ INITIAL RENDER (on page load)
------------------------------------------------ */
if (projects && projectsContainer) {
  renderProjects(projects, projectsContainer, 'h2');
  renderPieChart(projects);

  // update initial title
  if (titleElement) {
    titleElement.textContent = `Projects (${projects.length})`;
  }
} else {
  console.warn('Projects data or container not found.');
}

/* ------------------------------------------------
   ✅ SEARCH FILTER EVENT LISTENER
------------------------------------------------ */
searchInput.addEventListener('input', (event) => {
  // update query
  query = event.target.value.toLowerCase().trim();

  // get filtered projects based on BOTH filters
  const filtered = getFilteredProjects();

  // re-render everything
  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);

  // update title
  if (titleElement) {
    titleElement.textContent = `Projects (${filtered.length})`;
  }
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.target.value.trim()) {
    // Reset query and selected filters
    query = '';
    selectedIndex = -1;

    // Re-render everything with all projects
    renderProjects(projects, projectsContainer, 'h2');
    renderPieChart(projects);

    // Update the title
    if (titleElement) {
      titleElement.textContent = `Projects (${projects.length})`;
    }
  }
});

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
