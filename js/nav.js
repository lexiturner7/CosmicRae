document.getElementById("navbar").innerHTML = `
  <nav id="navbar">
    <a class="nav-logo" href="/index.html">
      CosmicRae
    </a>
    <ul>
      <li>
        <a href="/pages/explore/explore.html">Explore</a>
      </li>
      <li>
        <a href="/pages/track/track.html">Track</a>
      </li>
      <li>
        <a href="/pages/discover/discover.html">Discover</a>
      </li>
      <li>
        <a href="/pages/learn/learn.html">Learn</a>
      </li>
    </ul>
  </nav>`;

const navLinks = document.querySelectorAll("ul li a");
const currentPath = window.location.pathname.split("/").pop();

navLinks.forEach((link) => {
  const linkPath = link.href.split("/").pop();
  if (
    currentPath === linkPath ||
    (currentPath === "" && linkPath === "index.html")
  ) {
    link.classList.add("active");
  }
});
