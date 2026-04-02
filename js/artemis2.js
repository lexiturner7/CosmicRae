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

// ******************** MISSION PHASE TIMELINE ********************
