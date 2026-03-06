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

    Object.entries(planet.sections).forEach(([key, value]) => {
      const planetSize = document.createElement("a");
      planetSize.href = `#${key}`;
      planetSize.textContent = key;
      planetJumpLinks.appendChild(planetSize);
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

getPlanetDataByID();
