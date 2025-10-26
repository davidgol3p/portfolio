import { fetchJSON, renderProjects, fetchGithubData } from "./global.js";

const basePath =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "./"
    : "/portfolio/";

const projects = await fetchJSON(`${basePath}lib/projects.json`);

const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector(".projects");
renderProjects(latestProjects, projectsContainer, "h2");

const githubData = await fetchGithubData("davidgol3p");
const profileStats = document.querySelector("#profile-stats");

if (profileStats && githubData) {
  profileStats.innerHTML = `
    <dl class="profile-stats">
      <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
      <dt>Followers:</dt><dd>${githubData.followers}</dd>
      <dt>Following:</dt><dd>${githubData.following}</dd>
    </dl>
  `;
}