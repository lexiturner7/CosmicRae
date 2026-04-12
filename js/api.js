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
  document.getElementById("apod-title-skeleton").style.display = "none";
  document.getElementById("apod-explanation-skeleton").style.display = "none";
  document.getElementById("apod-explanation").style.display = "block";
  document.getElementById("apod-title").textContent = data.title;
  document.getElementById("apod-explanation").textContent = data.explanation;

  const apodCopyrightElement = document.getElementById("apod-copyright");
  if (data.copyright && apodCopyrightElement) {
    apodCopyrightElement.textContent = data.copyright;
  }

  const apodImageElement = document.getElementById("apod-img");
  const errorBox = document.getElementById("apod-img-error");
  apodImageElement.style.display = "none";
  errorBox.style.display = "none";

  if (data.media_type === "image") {
    apodImageElement.src = data.url;
    apodImageElement.onload = () => {
      document.getElementById("apod-img-skeleton").style.display = "none";
      apodImageElement.style.display = "block";
    };
    apodImageElement.onerror = () => {
      document.getElementById("apod-img-skeleton").style.display = "none";
      errorBox.style.display = "flex";
      errorBox.innerHTML = `
        <p style="font-size: 3rem;">⚠️</p>
        <p>Image failed to load.</p>
      `;
    };
  } else {
    document.getElementById("apod-img-skeleton").style.display = "none";
    errorBox.style.display = "flex";
    errorBox.innerHTML = `
      <p style="font-size: 3rem;">🔭</p>
      <p>Today's APOD is a video!</p>
      <a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" style="color: var(--purple); font-family: 'Share Tech Mono'; font-size: 13px;">Watch on NASA</a>
    `;
  }
}

// ********** ERROR STATE **********
function displayError() {
  document.getElementById("apod-img-skeleton").style.display = "none";
  document.getElementById("apod-title-skeleton").style.display = "none";
  document.getElementById("apod-explanation-skeleton").style.display = "none";

  document.getElementById("apod-img").style.display = "none";
  const errorBox = document.getElementById("apod-img-error");
  errorBox.style.display = "flex";
  errorBox.innerHTML = `
    <p style="font-size: 3rem;">⚠️</p>
    <p>Unable to load today's image</p>
  `;

  document.getElementById("apod-title").textContent =
    "Unable to load today's image";
  document.getElementById("apod-explanation").style.display = "block";
  document.getElementById("apod-explanation").textContent =
    "NASA's API is taking a break. Try refreshing in a few minutes!";
}

// ********** FETCH WITH RETRY **********
async function fetchWithRetry(url, retries = 2, delay = 2000) {
  for (let i = 0; i <= retries; i++) {
    const response = await fetch(url);
    if (response.ok) return response;
    if (response.status === 503 && i < retries) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }
    throw new Error(`NASA API error: ${response.status}`);
  }
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
    const response = await fetchWithRetry(url);
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
