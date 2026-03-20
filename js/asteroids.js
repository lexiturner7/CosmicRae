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
  if (estimated_diameter_max < 10) {
    return "As big as a school bus!";
  } else if (estimated_diameter_max < 50) {
    return "As big as a blue whale!";
  } else if (estimated_diameter_max < 200) {
    return "As big as a football field!";
  } else if (estimated_diameter_max < 500) {
    return "As big as the Eiffel Tower!";
  } else if (estimated_diameter_max < 1000) {
    return "As big as the world's tallest building!";
  } else if (estimated_diameter_max < 5000) {
    return "Wider than a small town!";
  } else {
    return "The size that wiped out the dinosaurs!";
  }
}

// ******************** FETCH FUNCTION ********************

//gets todays date and reformats it to yyyy-mm-yy
let todaysDate = new Date();
const formattedTodaysDate = todaysDate.toISOString().slice(0, 10);

async function getAsteroids() {
  //increases today's date by 7 and reformats it to yyyy-mm-dd
  let endDate = new Date(formattedTodaysDate);
  endDate.setDate(endDate.getDate() + 7);
  const formattedEndDate = endDate.toISOString().slice(0, 10);

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedTodaysDate}&end_date=${formattedEndDate}&api_key=SBSIoshhB1ZROHaZDXumcYjjKFIRSryuL9L8FbzN`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const todayAsteroids = [];
    const weekAsteroids = [];

    Object.entries(data.near_earth_objects).forEach(([date, asteroids]) => {
      asteroids.forEach((asteroid) => {
        weekAsteroids.push(asteroid);
        if (date === formattedTodaysDate) {
          todayAsteroids.push(asteroid);
        }
      });
    });

    if (todayAsteroids.length === 0) {
      document.getElementById("stat-total").textContent = "0";
      document.getElementById("stat-hazardous").textContent = "0";
      document.getElementById("stat-closest").textContent = "N/A";
      document.getElementById("stat-largest").textContent = "N/A";
      return;
    }

    todayAsteroids.sort(
      (a, b) =>
        parseFloat(a.close_approach_data[0].miss_distance.lunar) -
        parseFloat(b.close_approach_data[0].miss_distance.lunar),
    );

    const totalCount = document.getElementById("stat-total");
    totalCount.textContent = todayAsteroids.length;

    const hazardousCount = document.getElementById("stat-hazardous");
    hazardousCount.textContent = todayAsteroids.filter(
      (a) => a.is_potentially_hazardous_asteroid === true,
    ).length;

    // ************** CALCULATE CLOSEST *****************
    const closest = todayAsteroids.reduce((prev, curr) => {
      return parseFloat(curr.close_approach_data[0].miss_distance.lunar) <
        parseFloat(prev.close_approach_data[0].miss_distance.lunar)
        ? curr
        : prev;
    });

    const closestApproach = document.getElementById("stat-closest");
    closestApproach.textContent = `${parseFloat(closest.close_approach_data[0].miss_distance.lunar).toFixed(2)} LD`;

    // ************** CALCULATE LARGEST *****************

    const largest = todayAsteroids.reduce((prev, curr) => {
      return parseFloat(curr.estimated_diameter.meters.estimated_diameter_max) >
        parseFloat(prev.estimated_diameter.meters.estimated_diameter_max)
        ? curr
        : prev;
    });

    const largestAsteroid = document.getElementById("stat-largest");
    largestAsteroid.textContent = `${parseFloat(
      largest.estimated_diameter.meters.estimated_diameter_max,
    ).toFixed(0)} meters`;

    // ******************* CHART ***********************

    const chartLabels = todayAsteroids.map((asteroid) =>
      asteroid.name.replace("(", "").replace(")", ""),
    );

    const chartDistances = todayAsteroids.map((asteroid) =>
      parseFloat(asteroid.close_approach_data[0].miss_distance.lunar),
    );

    const chartColors = todayAsteroids.map((asteroid) =>
      asteroid.is_potentially_hazardous_asteroid
        ? "rgba(239, 68, 68, 0.7)"
        : "rgba(34, 197, 94, 0.6)",
    );

    const ctx = document.getElementById("asteroid-chart").getContext("2d");

    new Chart(ctx, {
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
            data: todayAsteroids.map(() => 1),
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
            ticks: { color: "#8899bb", font: { size: 9 } },
            grid: { color: "rgba(255,255,255,0.04)" },
          },
          y: {
            ticks: {
              color: "#8899bb",
              font: { size: 9 },
              callback: (v) => v + " LD",
            },
            grid: { color: "rgba(255,255,255,0.04)" },
            title: {
              display: true,
              text: "Lunar Distances from Earth",
              color: "#8899bb",
              font: { size: 9 },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch data", error);
  }
}

getAsteroids();

// ******************* CHART ***********************

// {
//   OBJECT"near_earth_objects": {
//     KEY"2026-03-18": Value (ARRAY) [ asteroid, asteroid, asteroid ],
//     "2026-03-19": [ asteroid, asteroid, asteroid ],
//     ...
//   }
// }

// near_earth_objects:
//                     date:
//                           links:
//                           id:
//                           neo_reference_id:
//                           name:
//                           nasa_jpl_url:
//                           absolute_magnitude:
//                           estimated_diameter:
//                                             kilometers:
//                                                       estimated_diameter_min:
//                                                       estimated_diameter_max:
//                                             meters:
//                                                       estimated_diameter_min:
//                                                       estimated_diameter_max:
//                                             miles:
//                                                       estimated_diameter_min:
//                                                       estimated_diameter_max:
//                                             feet:
//                                                       estimated_diameter_min:
//                                                       estimated_diameter_max:
//                           is_potentially_hazardous_asteroid:
//                           close_approach_data:
//                                             close_approach_date:
//                                             close_approach_date_full:
//                                             epoch_date_close_approach:
//                                             relative_velocity:
//                                                       kilometers_per_second:
//                                                       kilometers_per_hour:
//                                                       miles_per_hour:
//                                             miss_distance:
//                                                       astronomical:
//                                                       lunar:
//                                                       kilometers:
//                                                       miles:
//                                             orbiting_body:
//                           is_sentry_object:
