// ************* CREATE FLOATING PLANETS ************

const planetData = [
  { size: "16px", color: "radial-gradient(circle at 35% 35%, #b5b5b5, #555)" },
  {
    size: "18px",
    color: "radial-gradient(circle at 35% 35%, #e8cda0, #a08060)",
  },
  {
    size: "22px",
    color: "radial-gradient(circle at 35% 35%, #4a9eff, #1a3a7c)",
  },
  {
    size: "18px",
    color: "radial-gradient(circle at 35% 35%, #c1440e, #7a2a08)",
  },
  {
    size: "32px",
    color: "radial-gradient(circle at 35% 35%, #c88b3a, #7a5020)",
  },
  {
    size: "28px",
    color: "radial-gradient(circle at 35% 35%, #e4d191, #b0a060)",
  },
  {
    size: "22px",
    color: "radial-gradient(circle at 35% 35%, #7de8e8, #40a0a0)",
  },
  {
    size: "20px",
    color: "radial-gradient(circle at 35% 35%, #3f54ba, #1a2a7a)",
  },
];

const planetRow = document.getElementById("home-planets-row");

planetData.forEach((planet, index) => {
  const planetDiv = document.createElement("div");

  planetDiv.classList.add("planet");
  planetDiv.style.width = planet.size;
  planetDiv.style.height = planet.size;
  planetDiv.style.background = planet.color;
  planetDiv.style.animationDelay = `${index * 0.4}s`;

  planetRow.appendChild(planetDiv);
});

// *************** CREATE RANDOM FUN FACT *******************

async function randomFunFact() {
  try {
    const response = await fetch("data/planets.json");
    const data = await response.json();

    const randomIndex = Math.floor(Math.random() * data.planets.length);
    const randomPlanet = data.planets[randomIndex];
    const randomFunFact = randomPlanet.funFact;

    const funFact = document.getElementById("home-funfact-text");
    funFact.textContent = randomFunFact;
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

randomFunFact();

// *************** CREATE STARS *******************

const homeStars = document.getElementById("home-stars");

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

  homeStars.appendChild(starDiv);
}

for (let i = 0; i < 140; i++) {
  generateStars();
}
