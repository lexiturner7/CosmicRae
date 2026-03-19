// MAP FUNCTION

var map = L.map("iss-map").setView([51.505, -0.09], 4);
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
).addTo(map);

const marker = L.marker([51.5, -0.09]).addTo(map);

async function fetchISS() {
  const url = `http://api.open-notify.org/iss-now.json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const isslatitude = data.iss_position.latitude;
    const isslongitude = data.iss_position.longitude;

    const issLatitudeElement = document.getElementById("iss-latitude");
    if (issLatitudeElement) {
      issLatitudeElement.textContent = `Latitude: ${isslatitude}`;
    }
    const issLongitudeElement = document.getElementById("iss-longitude");
    if (issLongitudeElement) {
      issLongitudeElement.textContent = `Longitude: ${isslongitude}`;
    }

    marker.setLatLng([isslatitude, isslongitude]);
    map.setView([isslatitude, isslongitude]);
  } catch (error) {
    console.error("Failed to fetch ISS location data", error);
  }
}

//CREW FUNCTION

async function fetchCrew() {
  const url = `http://api.open-notify.org/astros.json`;
  const crew = document.getElementById("iss-astros");
  try {
    const response = await fetch(url);
    const data = await response.json();

    crew.innerHTML = "";
    data.people.forEach((person) => {
      if (person.craft === "ISS") {
        const listItem = document.createElement("li");
        listItem.textContent = person.name;
        crew.appendChild(listItem);
      }
    });
  } catch (error) {
    console.error("Failed to fetch ISS location data", error);
  }
}

//FUNCTION CALLS

let intervalID = setInterval(fetchISS, 5000);
fetchISS();
fetchCrew();

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
