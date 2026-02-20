//APOD API

async function fetchData(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=SBSIoshhB1ZROHaZDXumcYjjKFIRSryuL9L8FbzN${date ? `&date=${date}` : ""}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const apodtitle = data.title;
    const apodexplanation = data.explanation;
    const apodcopyright = data.copyright;
    const apoddate = data.date;
    const apodimg = data.url;

    const apodImageElement = document.getElementById("apod-img");
    if (data.media_type === "image") {
      if (apodImageElement) {
        apodImageElement.src = apodimg;
      }
    } else {
      console.log("Today's APOD is a video");
    }

    const apodTitleElement = document.getElementById("apod-title");
    if (apodTitleElement) {
      apodTitleElement.textContent = apodtitle;
    }

    const apodExplanationElement = document.getElementById("apod-explanation");
    if (apodExplanationElement) {
      apodExplanationElement.textContent = apodexplanation;
    }

    const apodCopyrightElement = document.getElementById("apod-copyright");
    if (apodcopyright) {
      if (apodCopyrightElement) {
        apodCopyrightElement.textContent = apodcopyright;
      }
    }

    const apodDateElement = document.getElementById("apod-date");
    if (apodDateElement) {
      apodDateElement.textContent = apoddate;
    }
  } catch (error) {
    console.error("Failed to fetch APOD data", error);
  }
}

document
  .getElementById("apod-date-picker")
  .addEventListener("change", function (event) {
    fetchData(event.target.value);
  });

fetchData();
