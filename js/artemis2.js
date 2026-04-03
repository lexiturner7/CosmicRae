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

// ******************** ELAPSED TIME CLOCK ********************

const start = new Date("2026-04-01T22:35:00Z");

function getElapsedTime() {
  const end = new Date();
  const elapsed = end.getTime() - start.getTime();
  const seconds = Math.floor((elapsed / 1000) % 60);
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));

  const d = String(days);
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  document.getElementById("clock").textContent = `${d} : ${h} : ${m} : ${s}`;
}

getElapsedTime();
setInterval(getElapsedTime, 1000);

// ******************** LIVE EPHEMERIS DATA ********************

// ********** FETCH DATA **********
async function loadEphemeris() {
  try {
    const response = await fetch("../../data/artemis-II-OEM.asc");
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// ********** FILTER TODAYS DATA **********

function getTodaysEphemeris(data) {
  const lines = data.split("\n");
  const filteredData = lines.filter((line) => line.startsWith("2026"));

  const ephemeris = filteredData.map((line) => {
    const parts = line.split(" ");
    return {
      timestamp: parts[0],
      x: parseFloat(parts[1]),
      y: parseFloat(parts[2]),
      z: parseFloat(parts[3]),
      vx: parseFloat(parts[4]),
      vy: parseFloat(parts[5]),
      vz: parseFloat(parts[6]),
    };
  });

  let currentEntry;
  let todaysDate = new Date();
  for (const entry of ephemeris) {
    if (new Date(entry.timestamp) <= todaysDate) {
      currentEntry = entry;
    } else {
      break;
    }
  }
  return currentEntry;
}

// ********** CALCULATIONS **********

function artemisCalculations(todayData) {
  // **** update live orion tracker *****
  const rawDistance = Math.sqrt(
    todayData.x ** 2 + todayData.y ** 2 + todayData.z ** 2,
  );

  const orionPath = document.getElementById("orion-path");
  const pathLength = orionPath.getTotalLength();
  const progress = Math.min(rawDistance / 384400, 1);
  const point = orionPath.getPointAtLength(progress * pathLength);

  document.getElementById("orion-dot").setAttribute("cx", point.x);
  document.getElementById("orion-dot").setAttribute("cy", point.y);
  document.getElementById("orion-ring").setAttribute("cx", point.x);
  document.getElementById("orion-ring").setAttribute("cy", point.y);
  document.getElementById("orion-label").setAttribute("x", point.x);
  document.getElementById("orion-label").setAttribute("y", point.y - 18);

  // ******* CALCULATING DISTANCE AND SPEED **********
  const miles = 0.621371;

  const distance = parseFloat(
    (rawDistance * miles).toFixed(0),
  ).toLocaleString();
  const distanceRemaining = parseFloat(
    ((384400 - rawDistance) * miles).toFixed(0),
  ).toLocaleString();
  const speedMph = parseFloat(
    (
      Math.sqrt(todayData.vx ** 2 + todayData.vy ** 2 + todayData.vz ** 2) *
      miles *
      3600
    ).toFixed(0),
  ).toLocaleString();

  document.getElementById("distance").textContent = `${distance} mi`;
  document.getElementById("distance-remaining").textContent =
    `${distanceRemaining} mi`;
  document.getElementById("speed").textContent = `${speedMph} mph`;
}

async function init() {
  const data = await loadEphemeris();
  const todayData = getTodaysEphemeris(data);
  artemisCalculations(todayData);
}

init();
setInterval(init, 60000);
