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

// ****************** TIMELINE POPUP POSITIONING ******************
const timelineItems = document.querySelectorAll(".mission-timeline-item");

timelineItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const popup = item.querySelector(".timeline-popup");

    popup.style.display = "flex";
    popup.style.top = "0";
    popup.style.bottom = "auto";

    const rect = popup.getBoundingClientRect();

    if (rect.bottom > window.innerHeight) {
      popup.style.top = "auto";
      popup.style.bottom = "0";
    }
  });

  item.addEventListener("mouseleave", () => {
    const popup = item.querySelector(".timeline-popup");
    popup.style.display = "none";
  });
});
