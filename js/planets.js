async function getPlanetData() {
  try {
    const response = await fetch("../../data/planets.json");
    const data = await response.json();
    const container = document.getElementById("planets-grid");

    data.planets.forEach((planet) => {
      const planetLink = document.createElement("a");
      planetLink.href = `planet.html?id=${planet.id}`;

      planetLink.classList.add("card", "card-discover");

      const planetName = document.createElement("h3");
      planetName.textContent = `${planet.name}`;

      const planetImage = document.createElement("img");
      planetImage.src = `../../assets/images/${planet.image}`;

      const planetTagline = document.createElement("p");
      planetTagline.textContent = `${planet.tagline}`;

      planetLink.appendChild(planetName);
      planetLink.appendChild(planetImage);
      planetLink.appendChild(planetTagline);
      container.appendChild(planetLink);
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

getPlanetData();

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
