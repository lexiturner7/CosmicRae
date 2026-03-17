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

function shootingStar() {
  const shootingDiv = document.createElement("div");
  const side = Math.floor(Math.random() * 4);
  const angle = Math.random() * 120 - 60;
  const dist = 300 + Math.random() * 400;
  const duration = 1.2 + Math.random() * 1.5;
  const length = 80 + Math.random() * 120;

  let startX, startY;

  if (side === 0) {
    startX = Math.random() * 100;
    startY = 0;
  } else if (side === 1) {
    startX = 100;
    startY = Math.random() * 100;
  } else if (side === 2) {
    startX = Math.random() * 100;
    startY = 100;
  } else {
    startX = 0;
    startY = Math.random() * 100;
  }

  shootingDiv.classList.add("shoot");
  shootingDiv.style.left = `${startX}%`;
  shootingDiv.style.top = `${startY}%`;
  shootingDiv.style.width = `${length}px`;
  shootingDiv.style.background = `linear-gradient(90deg, transparent, rgba(255,255,255,0.6), white)`;
  shootingDiv.style.setProperty("--angle", `${angle}deg`);
  shootingDiv.style.setProperty("--dist", `${dist}px`);
  shootingDiv.style.animationDuration = `${duration}s`;
  shootingDiv.style.animationTimingFunction = "linear";
  shootingDiv.style.animationFillMode = "forwards";

  exploreStars.appendChild(shootingDiv);
  setTimeout(() => shootingDiv.remove(), duration * 1000 + 100);
  setTimeout(shootingStar, 1500 + Math.random() * 2500);
}

shootingStar();
shootingStar();
