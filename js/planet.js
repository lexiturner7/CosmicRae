let params = new URLSearchParams(document.location.search);
let planetID = params.get("id");

const activePlanet = document.getElementById(`${planetID}-nav`);

if (activePlanet) {
  activePlanet.classList.add("active");
}

async function getPlanetDataByID() {
  try {
    const response = await fetch("../../data/planets.json");
    const data = await response.json();
    const planet = data.planets.find((p) => p.id === planetID);

    const planetJumpLinks = document.getElementById("planet-jump-links");

    const planetName = document.getElementById("planet-name");
    planetName.textContent = `${planet.name}`;

    const planetImage = document.getElementById("planet-image");
    planetImage.src = `../../assets/images/${planet.image}`;

    const planetTagline = document.getElementById("planet-tagline");
    planetTagline.textContent = `${planet.tagline}`;

    const planetFunFact = document.getElementById("planet-funfact");
    planetFunFact.textContent = `${planet.funFact}`;

    const sectionsContainer = document.getElementById("planet-sections");

    if (planet.featuredLink) {
      const featuredLinkContainer = document.getElementById(
        "planet-featured-link",
      );
      const iframe = document.createElement("iframe");
      iframe.src = planet.featuredLink.url;
      iframe.allowFullscreen = true;
      featuredLinkContainer.appendChild(iframe);
    }

    Object.entries(planet.sections).forEach(([key, value]) => {
      const jumpLink = document.createElement("a");
      jumpLink.href = `#${key}`;
      jumpLink.textContent = value.title;
      planetJumpLinks.appendChild(jumpLink);

      const planetSection = document.createElement("section");
      planetSection.id = key;
      sectionsContainer.appendChild(planetSection);

      const sectionTitle = document.createElement("h2");
      sectionTitle.textContent = value.title;
      planetSection.appendChild(sectionTitle);

      const sectionContent = document.createElement("p");
      sectionContent.textContent = value.content;
      planetSection.appendChild(sectionContent);
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

getPlanetDataByID();

// ******************** TWINKLING STARS BG ********************
const exploreStars = document.getElementById("stars-layer");

function generateStars() {
  const randomSize = Math.random() * 2 + 1;
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const starDiv = document.createElement("div");

  starDiv.classList.add("star");
  starDiv.style.width = `${randomSize}px`;
  starDiv.style.height = `${randomSize}px`;
  starDiv.style.left = `${randomX}%`;
  starDiv.style.top = `${randomY}%`;
  starDiv.style.animationDelay = `${Math.random() * 3}s`;

  exploreStars.appendChild(starDiv);
}

for (let i = 0; i < 140; i++) {
  generateStars();
}
