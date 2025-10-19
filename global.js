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

let pages = [
    { url: '../', title: 'Home' },
    { url: '../projects', title: 'Projects' },
    { url: '../contact', title: 'Contact' },
    { url: '../profile', title: 'Resume' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/website/"; 
    let url = p.url;
    let title = p.title;
    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }
    let a = document.createElement('a');
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    
    a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
    );
    a.href = url;
    a.textContent = title;
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
