console.log('IT’S ALIVE!');

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// if (currentLink) {
//   currentLink.classList.add("current");
// }

// Define your base path (adjust "/website/" to match your repo folder if needed)
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"           // Local dev
    : "/portfolio/";  // Deployed site base path

// Define site pages with clean relative URLs
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "profile/", title: "Resume" }
];

// Create nav
let nav = document.createElement("nav");
document.body.prepend(nav);

// Build links
for (let p of pages) {
  let url = p.url;

  // Ensure URL includes the base path
  if (!url.startsWith("http") && !url.startsWith("/")) {
    url = BASE_PATH + url;
  }

  let a = document.createElement("a");
  a.href = url;
  a.textContent = p.title;

  // Apply "current" class if this link matches the current page
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
            <option value="auto" selected>Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
      </label>`,
);

// let select = document.querySelector("#color-scheme");
// select.addEventListener("input", function (event) {
//     console.log("color scheme changed to", event.target.value);
//     document.documentElement.style.setProperty('color-scheme', event.target.value);
// });

// Find the <select> element
let select = document.querySelector("#color-scheme");

// ✅ Step 1: When the user changes the color scheme
select.addEventListener("input", function (event) {
  const scheme = event.target.value;
  console.log("color scheme changed to", scheme);

  // Apply the selected scheme to the root element
  if (scheme === "auto") {
    document.documentElement.style.removeProperty("color-scheme");
  } else {
    document.documentElement.style.colorScheme = scheme;
  }

  // ✅ Save the preference in localStorage
  localStorage.colorScheme = scheme;
});

// ✅ Step 2: When the page loads, restore the previous setting
if ("colorScheme" in localStorage) {
  const savedScheme = localStorage.colorScheme;

  // Set the <select> to show the saved option
  select.value = savedScheme;

  // Apply the saved scheme to the page
  if (savedScheme === "auto") {
    document.documentElement.style.removeProperty("color-scheme");
  } else {
    document.documentElement.style.colorScheme = savedScheme;
  }

  console.log("Restored color scheme:", savedScheme);
}
