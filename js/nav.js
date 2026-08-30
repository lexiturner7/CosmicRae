document.getElementById("navbar").innerHTML = `
  <nav>
    <a class="nav-logo" href="/index.html">CosmicRae</a>
    <ul>
      <li><a href="/index.html" id="homenav">Home</a></li>
      <li><a href="/pages/explore/explore.html" id="explorenav">Explore</a></li>
      <li><a href="/pages/track/track.html" id="tracknav">Track</a></li>
      <li><a href="/pages/discover/discover.html" id="discovernav">Discover</a></li>
      <li><a href="/pages/lab/lab.html" id="labnav">Lab</a></li>
    </ul>
    <button id="hamburger-btn" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <div id="nav-overlay"></div>

  <div id="slide-panel">
    <div id="panel-header">
      <a id="panel-logo" href="/index.html">CosmicRae</a>
    </div>
    <ul id="panel-nav-links">
      <li><a href="/index.html" id="panel-homenav" data-flash="flash-home">Home</a></li>
      <li><a href="/pages/explore/explore.html" id="panel-explorenav" data-flash="flash-explore">Explore</a></li>
      <li><a href="/pages/track/track.html" id="panel-tracknav" data-flash="flash-track">Track</a></li>
      <li><a href="/pages/discover/discover.html" id="panel-discovernav" data-flash="flash-discover">Discover</a></li>
      <li><a href="/pages/lab/lab.html" id="panel-labnav" data-flash="flash-lab">Lab</a></li>
    </ul>
    <div id="panel-footer">Because the universe is for everyone.</div>
  </div>
`;

// ******************** ACTIVE LINK HIGHLIGHTING ********************

const navLinks = document.querySelectorAll("ul li a");
const panelLinks = document.querySelectorAll("#panel-nav-links li a");
const currentPath = window.location.pathname;

navLinks.forEach(function (link) {
  const linkPath = link.href.split("/").pop();
  const linkPathFull = new URL(link.href).pathname;

  if (
    currentPath === linkPathFull ||
    (currentPath === "/" && linkPath === "index.html") ||
    (currentPath.includes("/explore/") && link.id === "explorenav") ||
    (currentPath.includes("/track/") && link.id === "tracknav") ||
    (currentPath.includes("/discover/") && link.id === "discovernav") ||
    (currentPath.includes("/lab/") && link.id === "labnav")
  ) {
    link.classList.add("active");
  }
});

panelLinks.forEach(function (link) {
  const linkPath = link.href.split("/").pop();
  const linkPathFull = new URL(link.href).pathname;

  if (
    currentPath === linkPathFull ||
    (currentPath === "/" && linkPath === "index.html") ||
    (currentPath.includes("/explore/") && link.id === "panel-explorenav") ||
    (currentPath.includes("/track/") && link.id === "panel-tracknav") ||
    (currentPath.includes("/discover/") && link.id === "panel-discovernav") ||
    (currentPath.includes("/lab/") && link.id === "panel-labnav")
  ) {
    link.classList.add("active");
  }
});

// ******************** HAMBURGER MENU ********************

const hamburgerBtn = document.getElementById("hamburger-btn");
const slidePanel = document.getElementById("slide-panel");
const navOverlay = document.getElementById("nav-overlay");

function openMenu() {
  if (window.innerWidth > 768) return;
  slidePanel.classList.add("open");
  navOverlay.classList.add("active");
  hamburgerBtn.classList.add("open");
}

function closeMenu() {
  slidePanel.classList.remove("open");
  navOverlay.classList.remove("active");
  hamburgerBtn.classList.remove("open");
}

hamburgerBtn.addEventListener("click", openMenu);
navOverlay.addEventListener("click", closeMenu);

// ******************** PANEL LINK FLASH ON CLICK ********************

panelLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const destination = link.href;
    const flashClass = link.dataset.flash;

    panelLinks.forEach(function (l) {
      l.classList.remove("active");
    });

    link.classList.add(flashClass);

    setTimeout(function () {
      closeMenu();
    }, 300);

    setTimeout(function () {
      window.location.href = destination;
    }, 500);
  });
});
