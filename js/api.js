//APOD API

// ********** APOD CACHE **********
function getTodaysCache() {
  const today = new Date().toISOString().split("T")[0];
  const cached = localStorage.getItem(`apod-${today}`);
  return cached ? JSON.parse(cached) : null;
}

function saveToCache(data) {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem(`apod-${today}`, JSON.stringify(data));
}

// ********** RESET DISPLAY **********
function resetDisplay() {
  document.getElementById("apod-img").style.display = "none";
  document.getElementById("apod-img-error").style.display = "none";
  document.getElementById("apod-img-skeleton").style.display = "block";
  document.getElementById("apod-title-skeleton").style.display = "block";
  document.getElementById("apod-explanation-skeleton").style.display = "block";
  document.getElementById("apod-explanation").style.display = "none";
}

// ********** DISPLAY DATA **********
function displayData(data) {
  document.getElementById("apod-img-skeleton").style.display = "none";
  document.getElementById("apod-title-skeleton").style.display = "none";
  document.getElementById("apod-explanation-skeleton").style.display = "none";
  document.getElementById("apod-explanation").style.display = "block";

  const apodImageElement = document.getElementById("apod-img");
  if (data.media_type === "image") {
    apodImageElement.style.display = "block";
    apodImageElement.src = data.url;
  } else {
    document.getElementById("apod-img-skeleton").style.display = "none";
    document.getElementById("apod-img-error").style.display = "flex";
    document.getElementById("apod-img-error").innerHTML = `
      <p style="font-size: 3rem;">🔭</p>
      <p>Today's APOD is a video!</p>
      <a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" style="color: var(--purple); font-family: 'Share Tech Mono'; font-size: 13px;">Watch on NASA</a>
    `;
  }

  document.getElementById("apod-title").textContent = data.title;
  document.getElementById("apod-explanation").textContent = data.explanation;

  const apodCopyrightElement = document.getElementById("apod-copyright");
  if (data.copyright && apodCopyrightElement) {
    apodCopyrightElement.textContent = data.copyright;
  }
}

// ********** ERROR STATE **********
function displayError() {
  document.getElementById("apod-img-skeleton").style.display = "none";
  document.getElementById("apod-title-skeleton").style.display = "none";
  document.getElementById("apod-explanation-skeleton").style.display = "none";
  document.getElementById("apod-img-error").style.display = "flex";
  document.getElementById("apod-title").textContent =
    "Unable to load today's image";
  document.getElementById("apod-explanation").style.display = "block";
  document.getElementById("apod-explanation").textContent =
    "NASA's API is taking a break. Try refreshing in a few minutes!";
}

// ********** FETCH DATA **********
async function fetchData(date) {
  resetDisplay();

  const url = `https://api.nasa.gov/planetary/apod?api_key=SBSIoshhB1ZROHaZDXumcYjjKFIRSryuL9L8FbzN${date ? `&date=${date}` : ""}`;

  if (!date) {
    const cached = getTodaysCache();
    if (cached) {
      displayData(cached);
      return;
    }
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();
    displayData(data);
    if (!date) {
      saveToCache(data);
    }
  } catch (error) {
    console.error("Failed to fetch APOD data", error);
    displayError();
  }
}

// ********** DATE PICKER **********
document
  .getElementById("apod-date-picker")
  .addEventListener("change", function (event) {
    fetchData(event.target.value);
  });

fetchData();
