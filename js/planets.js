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
