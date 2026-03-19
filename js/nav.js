document.getElementById("navbar").innerHTML = `
  <nav>
    <a class="nav-logo" href="/index.html">
      CosmicRae
    </a>
    <ul>
    <li>
        <a href="/index.html" id="homenav">Home</a>
      </li>
      <li>
        <a href="/pages/explore/explore.html" id="explorenav">Explore</a>
      </li>
      <li>
        <a href="/pages/track/track.html" id="tracknav">Track</a>
      </li>
      <li>
        <a href="/pages/discover/discover.html" id="discovernav">Discover</a>
      </li>
      <li>
        <a href="/pages/learn/learn.html" id="learnnav">Lab</a>
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
