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

// ******************** SIZE COMPARISON FUNCTION ********************

function sizeComparison(diameter) {
  if (diameter < 10) {
    return "As big as a school bus!";
  } else if (diameter < 50) {
    return "As big as a blue whale!";
  } else if (diameter < 200) {
    return "As big as a football field!";
  } else if (diameter < 500) {
    return "As big as the Eiffel Tower!";
  } else if (diameter < 1000) {
    return "As big as the world's tallest building!";
  } else if (diameter < 5000) {
    return "Wider than a small town!";
  } else {
    return "The size that wiped out the dinosaurs!";
  }
}

// ********************* GET ASTEROID DATA FUNCTION ***************************

//gets todays date and reformats it to yyyy-mm-yy
let todaysDate = new Date();
const formattedTodaysDate = todaysDate.toISOString().slice(0, 10);

async function fetchAsteroidData() {
  //increases today's date by 7 and reformats it to yyyy-mm-dd
  let endDate = new Date(formattedTodaysDate);
  endDate.setDate(endDate.getDate() + 7);
  const formattedEndDate = endDate.toISOString().slice(0, 10);

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedTodaysDate}&end_date=${formattedEndDate}&api_key=SBSIoshhB1ZROHaZDXumcYjjKFIRSryuL9L8FbzN`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data", error);
  }
}

// ********************* BUILD ASTEROID ARRAYS FUNCTION ***************************
let todayAsteroids = [];
let weekAsteroids = [];
let activeAsteroids = [];

function buildAsteroidArrays(data) {
  Object.entries(data.near_earth_objects).forEach(([date, asteroids]) => {
    asteroids.forEach((asteroid) => {
      weekAsteroids.push(asteroid);
      if (date === formattedTodaysDate) {
        todayAsteroids.push(asteroid);
      }
    });
  });

  todayAsteroids.sort(
    (a, b) =>
      parseFloat(a.close_approach_data[0].miss_distance.lunar) -
      parseFloat(b.close_approach_data[0].miss_distance.lunar),
  );

  weekAsteroids.sort(
    (a, b) =>
      parseFloat(a.close_approach_data[0].miss_distance.lunar) -
      parseFloat(b.close_approach_data[0].miss_distance.lunar),
  );

  activeAsteroids = [...todayAsteroids];
}

// ********************* UPDATE PAGE STATS FUNCTION ***************************

function updateStats(asteroidArray) {
  if (asteroidArray.length === 0) {
    document.getElementById("stat-total").textContent = "0";
    document.getElementById("stat-hazardous").textContent = "0";
    document.getElementById("stat-closest").textContent = "N/A";
    document.getElementById("stat-largest").textContent = "N/A";
    return;
  }

  const totalCount = document.getElementById("stat-total");
  totalCount.textContent = asteroidArray.length;

  const hazardousCount = document.getElementById("stat-hazardous");
  hazardousCount.textContent = asteroidArray.filter(
    (a) => a.is_potentially_hazardous_asteroid === true,
  ).length;

  // ***** CALCULATE CLOSEST ******
  const closest = asteroidArray.reduce((prev, curr) => {
    return parseFloat(curr.close_approach_data[0].miss_distance.lunar) <
      parseFloat(prev.close_approach_data[0].miss_distance.lunar)
      ? curr
      : prev;
  });

  const closestApproach = document.getElementById("stat-closest");
  closestApproach.textContent = `${parseFloat(closest.close_approach_data[0].miss_distance.lunar).toFixed(2)} LD`;

  // ***** CALCULATE LARGEST ******

  const largest = asteroidArray.reduce((prev, curr) => {
    return parseFloat(curr.estimated_diameter.meters.estimated_diameter_max) >
      parseFloat(prev.estimated_diameter.meters.estimated_diameter_max)
      ? curr
      : prev;
  });

  const largestAsteroid = document.getElementById("stat-largest");
  largestAsteroid.textContent = `${parseFloat(
    largest.estimated_diameter.meters.estimated_diameter_max,
  ).toFixed(0)} meters`;
}

// ********************* RENDER PAGE CHART FUNCTION ***************************
let chartInstance = null;

function renderChart(asteroidArray) {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const chartLabels = asteroidArray.map((asteroid) =>
    asteroid.name.replace("(", "").replace(")", ""),
  );

  const chartDistances = asteroidArray.map((asteroid) =>
    parseFloat(asteroid.close_approach_data[0].miss_distance.lunar),
  );

  const chartColors = asteroidArray.map((asteroid) =>
    asteroid.is_potentially_hazardous_asteroid
      ? "rgba(239, 68, 68, 0.7)"
      : "rgba(34, 197, 94, 0.6)",
  );

  const ctx = document.getElementById("asteroid-chart").getContext("2d");

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Miss Distance (Lunar Distances)",
          data: chartDistances,
          backgroundColor: chartColors,
          borderColor: chartColors,
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Moon (1 LD)",
          data: asteroidArray.map(() => 1),
          type: "line",
          borderColor: "rgba(200, 200, 200, 0.4)",
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.parsed.y.toFixed(2)} Lunar Distances from Earth`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#8899bb", font: { size: 12 } },
          grid: { color: "rgba(255,255,255,0.04)" },
        },
        y: {
          ticks: {
            color: "#8899bb",
            font: { size: 12 },
            callback: (v) => v + " LD",
          },
          grid: { color: "rgba(255,255,255,0.04)" },
          title: {
            display: true,
            text: "Lunar Distances from Earth",
            color: "#8899bb",
            font: { size: 11 },
          },
        },
      },
    },
  });
}

// **************************** THREAT LEVEL FUNCTIONS ******************************

function threatScore(diameter, lunarDistance) {
  const sizeScore = Math.min((diameter / 1000) * 50, 50);
  const distanceScore = Math.min((1 / lunarDistance) * 50, 50);
  return Math.round(sizeScore + distanceScore);
}

function threatLevel(score) {
  if (score < 30) return { label: "Low Risk", color: "var(--green)" };
  if (score < 60) return { label: "Watch", color: "var(--gold)" };
  return { label: "High Risk", color: "var(--red)" };
}

// **************************** CARD RENDER FUNCTION ******************************

function renderCards(asteroidArray) {
  const asteroidList = document.getElementById("asteroid-list");

  asteroidArray.forEach((asteroid) => {
    const score = threatScore(
      parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_max),
      parseFloat(asteroid.close_approach_data[0].miss_distance.lunar),
    );
    const level = threatLevel(score);

    const card = document.createElement("div");
    card.innerHTML = `
    <div class="asteroid-top">
      <h3>${asteroid.name}</h3>
      <p>${asteroid.close_approach_data[0].close_approach_date}</p>
      ${
        asteroid.is_potentially_hazardous_asteroid
          ? '<span class="hazard-badge">⚠ Potentially Hazardous</span>'
          : '<span class="safe-badge">✓ Safe</span>'
      }
    </div>

    <div class="asteroid-data">
      <div class="data-item">
        <div class="data-label">Miss Distance</div>
        <div class="data-value">${parseFloat(asteroid.close_approach_data[0].miss_distance.lunar).toFixed(2)} LD</div>
        <div class="data-sub">${parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toFixed(0)} km</div>
      </div>
      <div class="data-item">
        <div class="data-label">Diameter</div>
        <div class="data-value">~${parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_max).toFixed(0)}m</div>
        <div class="data-sub">${parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_min).toFixed(0)}–${parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_max).toFixed(0)}m range</div>
      </div>
      <div class="data-item">
        <div class="data-label">Velocity</div>
        <div class="data-value">${parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(1)} km/s</div>
        <div class="data-sub">${parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(0)} km/h</div>
      </div>
      <div class="data-item">
        <div class="data-label">Orbit Class</div>
        <div class="data-value">${asteroid.orbital_data?.orbit_class?.orbit_class_type ?? "Unknown"}</div>
        <div class="data-sub">Earth-crossing</div>
      </div>
    </div>

    <div>
      <div class="size-comparison">${sizeComparison(parseFloat(asteroid.estimated_diameter.meters.estimated_diameter_max))}</div>
    </div>
    
    <div class="threat-meter">
  <div class="threat-meter-label">Threat Assessment</div>
  <div class="threat-meter-wrap">
    <div class="threat-score-display" style="color: ${level.color}">
      ${score}
      <div class="threat-level-label">${level.label}</div>
    </div>
    <div class="threat-meter-track-wrap">
      <div class="threat-track">
        <div class="threat-needle" style="left: ${score}%"></div>
      </div>
      <div class="threat-track-labels">
        <span>Safe</span>
        <span>Watch</span>
        <span>Hazardous</span>
      </div>
    </div>
  </div>
</div>

    

  `;

    asteroidList.appendChild(card);
  });
}

// **************************** FILTER FUNCTION ***********************************

function applyFilters() {
  const activeFilter =
    document.querySelector(".filter-btn.active").dataset.filter;
  const sortValue = document.getElementById("sort-select").value;

  let filtered = [...activeAsteroids];

  const isWeek =
    document.querySelector(".filter-btn.active").dataset.filter === "week" ||
    document.querySelector(".filter-btn.active").dataset.filter ===
      "hazardous-week";

  document.querySelector("#asteroid-count .stat-label").textContent = isWeek
    ? "Asteroids This Week"
    : "Asteroids Today";
  document.querySelector("#hazardous-count .stat-label").textContent = isWeek
    ? "Potentially Hazardous This Week"
    : "Potentially Hazardous Today";
  document.querySelector("#closest .stat-label").textContent = isWeek
    ? "Closest This Week"
    : "Closest Today";
  document.querySelector("#largest .stat-label").textContent = isWeek
    ? "Largest This Week"
    : "Largest Today";

  if (activeFilter === "hazardous" || activeFilter === "hazardous-week") {
    filtered = filtered.filter((a) => a.is_potentially_hazardous_asteroid);
  }

  if (sortValue === "size") {
    filtered.sort(
      (a, b) =>
        parseFloat(b.estimated_diameter.meters.estimated_diameter_max) -
        parseFloat(a.estimated_diameter.meters.estimated_diameter_max),
    );
  } else if (sortValue === "distance") {
    filtered.sort(
      (a, b) =>
        parseFloat(a.close_approach_data[0].miss_distance.lunar) -
        parseFloat(b.close_approach_data[0].miss_distance.lunar),
    );
  }

  document.getElementById("asteroid-list").innerHTML = "";
  renderCards(filtered);
  renderChart(filtered);
  updateStats(filtered);
}

// **************************** INIT FUNCTION ***********************************

async function init() {
  const data = await fetchAsteroidData();
  buildAsteroidArrays(data);
  updateStats(todayAsteroids);
  renderChart(todayAsteroids);
  renderCards(todayAsteroids);

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (
        btn.dataset.filter === "week" ||
        btn.dataset.filter === "hazardous-week"
      ) {
        activeAsteroids = [...weekAsteroids];
      } else {
        activeAsteroids = [...todayAsteroids];
      }

      applyFilters();
    });
  });

  document
    .getElementById("sort-select")
    .addEventListener("change", applyFilters);
}

init();
