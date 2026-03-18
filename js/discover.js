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

// ******************** CONSTELLATIONS BG ********************

const canvas = document.getElementById("discover-canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const W = canvas.width;
const H = canvas.height;

const constellations = [
  {
    name: "Orion",
    color: [200, 220, 255],
    stars: [
      [0.04, 0.12, 2.0], // Betelgeuse
      [0.16, 0.1, 1.6], // Bellatrix
      [0.08, 0.38, 1.7], // Mintaka
      [0.1, 0.42, 1.7], // Alnilam
      [0.12, 0.46, 1.7], // Alnitak
      [0.02, 0.55, 2.8], // Saiph
      [0.18, 0.52, 0.2], // Rigel
    ],
    lines: [
      [0, 2],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [4, 6],
    ],
  },
  {
    name: "Ursa Major",
    color: [150, 200, 255],
    stars: [
      [0.36, 0.08, 1.8], // Dubhe
      [0.43, 0.1, 2.4], // Merak
      [0.5, 0.22, 2.4], // Phecda
      [0.45, 0.28, 2.5], // Megrez
      [0.54, 0.32, 1.8], // Alioth
      [0.62, 0.28, 2.1], // Mizar
      [0.7, 0.2, 1.9], // Alkaid
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    name: "Cassiopeia",
    color: [255, 200, 150],
    stars: [
      [0.72, 0.55, 2.2], // Caph
      [0.78, 0.48, 2.7], // Schedar
      [0.84, 0.52, 2.5], // Cih
      [0.9, 0.45, 2.7], // Ruchbah
      [0.96, 0.5, 3.4], // Segin
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    name: "Canis Major",
    color: [255, 240, 200],
    stars: [
      [0.76, 0.72, 0.0], // Sirius — brightest star in the sky
      [0.82, 0.62, 1.5], // Adhara
      [0.88, 0.68, 1.8], // Wezen
      [0.9, 0.78, 2.0], // Aludra
      [0.78, 0.82, 3.0], // Mirzam
      [0.72, 0.78, 2.9], // Furud
      [0.84, 0.88, 3.2], // lower star
    ],
    lines: [
      [0, 1],
      [0, 4],
      [1, 2],
      [2, 3],
      [3, 6],
      [4, 5],
      [2, 6],
    ],
  },
];

// maps each star to pixel coordinates

constellations.forEach((c) => {
  c.starPx = c.stars.map((s) => ({
    x: s[0] * W,
    y: s[1] * H,
    size: Math.max(0.8, (4 - s[2]) * 0.7),
    opacity: Math.max(0.5, 1 - s[2] * 0.15),
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.015 + 0.004,
  }));
});

// draw function

function draw() {
  ctx.clearRect(0, 0, W, H);

  constellations.forEach((constellation) => {
    const [r, g, b] = constellation.color;

    // draws lines

    constellation.lines.forEach(([i, j]) => {
      const starA = constellation.starPx[i];
      const starB = constellation.starPx[j];
      ctx.beginPath();
      ctx.moveTo(starA.x, starA.y);
      ctx.lineTo(starB.x, starB.y);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });

    // draws stars

    constellation.starPx.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${star.opacity})`;
      ctx.fill();
    });

    // draws names
    const avgX =
      constellation.starPx.reduce((sum, s) => sum + s.x, 0) /
      constellation.starPx.length;
    const avgY =
      constellation.starPx.reduce((sum, s) => sum + s.y, 0) /
      constellation.starPx.length;
    ctx.fillStyle = `rgba(${r},${g},${b},0.4)`;
    ctx.font = "10px sans-serif";
    ctx.fillText(constellation.name.toUpperCase(), avgX, avgY + 20);
  });

  requestAnimationFrame(draw);
}

draw();
