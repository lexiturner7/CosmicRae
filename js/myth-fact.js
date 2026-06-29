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

// ******************** GAME STATE ********************

let allMyths = [];
let questionsInRound = [];
let currentQuestionIndex = 0;
let score = 0;
let timeRemaining = 60;
let timerInterval = null;
let isAnswered = false;
let currentLevel = 1;
let gameMode = "solo";
let teams = [];
let selectedTeamIndex = null;
let selectedAnswer = null;
let answeredCorrectly = 0;
let mythsVisited = [];
let galleryViewed = [];
let currentLightboxMyth = null;
let teamCount = 2;

// ******************** FETCH DATA ********************

async function getStatements() {
  try {
    const response = await fetch("../../data/mythsfacts.json");
    const data = await response.json();
    allMyths = data;
  } catch (error) {
    console.error("Failed to fetch myth/fact data", error);
  }
}

// ******************** SHOW / HIDE SCREENS ********************

function showScreen(screenId) {
  document.getElementById("launch-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("reveal-screen").classList.add("hidden");
  document.getElementById("results-screen").classList.add("hidden");
  document.getElementById("gallery-screen").classList.add("hidden");
  document.getElementById("lightbox-screen").classList.add("hidden");
  document.getElementById(screenId).classList.remove("hidden");
  window.scrollTo(0, 0);
}

// ******************** LAUNCH SCREEN ********************

let currentStep = 1;

function updateProgressIndicator() {
  const indicator = document.getElementById("progress-indicator");
  indicator.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const dot = document.createElement("div");
    dot.classList.add("progress-dot");
    if (i === currentStep) {
      dot.classList.add("active");
    }
    if (i < currentStep) {
      dot.classList.add("done");
    }
    indicator.appendChild(dot);
  }
}

function goToStep(step) {
  currentStep = step;
  updateProgressIndicator();
  window.scrollTo(0, 0);

  document.getElementById("play-explore-selection").classList.add("hidden");
  document
    .getElementById("solo-group-classroom-selection")
    .classList.add("hidden");
  document.getElementById("enter-team-names").classList.add("hidden");
  document.getElementById("level-select").classList.add("hidden");
  document.getElementById("buttons").classList.add("hidden");

  if (step === 1) {
    document
      .getElementById("play-explore-selection")
      .classList.remove("hidden");
  }

  if (step === 2) {
    document
      .getElementById("solo-group-classroom-selection")
      .classList.remove("hidden");
    document.getElementById("buttons").classList.remove("hidden");
    document.getElementById("back-btn").classList.remove("hidden");
    document.getElementById("continue-btn").classList.remove("hidden");
    document.getElementById("launch-game-btn").classList.add("hidden");
  }

  if (step === 3) {
    document.getElementById("level-select").classList.remove("hidden");
    document.getElementById("buttons").classList.remove("hidden");
    document.getElementById("back-btn").classList.remove("hidden");
    document.getElementById("continue-btn").classList.add("hidden");
    document.getElementById("launch-game-btn").classList.remove("hidden");

    if (gameMode === "group" || gameMode === "classroom") {
      document.getElementById("enter-team-names").classList.remove("hidden");
    }
  }
}

// play button
document.getElementById("play").addEventListener("click", function () {
  goToStep(2);
});

// explore button
document.getElementById("explore").addEventListener("click", function () {
  showScreen("gallery-screen");
  renderGallery();
});

// solo button
document.getElementById("solo").addEventListener("click", function () {
  gameMode = "solo";
  document.getElementById("solo").classList.add("selected");
  document.getElementById("group").classList.remove("selected");
  document.getElementById("classroom").classList.remove("selected");
  document.getElementById("enter-team-names").classList.add("hidden");
});

// group button
document.getElementById("group").addEventListener("click", function () {
  gameMode = "group";
  document.getElementById("group").classList.add("selected");
  document.getElementById("solo").classList.remove("selected");
  document.getElementById("classroom").classList.remove("selected");
  document.getElementById("enter-team-names").classList.remove("hidden");
});

// classroom button
document.getElementById("classroom").addEventListener("click", function () {
  gameMode = "classroom";
  document.getElementById("classroom").classList.add("selected");
  document.getElementById("solo").classList.remove("selected");
  document.getElementById("group").classList.remove("selected");
  document.getElementById("enter-team-names").classList.remove("hidden");
});

// add team button
document.getElementById("add-team-btn").addEventListener("click", function () {
  if (teamCount < 4) {
    teamCount++;
    if (teamCount === 3) {
      document.getElementById("team-three").classList.remove("hidden");
    }
    if (teamCount === 4) {
      document.getElementById("team-four").classList.remove("hidden");
      document.getElementById("add-team-btn").classList.add("hidden");
    }
    document.getElementById("remove-team-btn").classList.remove("hidden");
  }
});

// remove team button
document
  .getElementById("remove-team-btn")
  .addEventListener("click", function () {
    if (teamCount > 2) {
      if (teamCount === 4) {
        document.getElementById("team-four").classList.add("hidden");
        document.getElementById("add-team-btn").classList.remove("hidden");
      }
      if (teamCount === 3) {
        document.getElementById("team-three").classList.add("hidden");
      }
      teamCount--;
    }
    if (teamCount === 2) {
      document.getElementById("remove-team-btn").classList.add("hidden");
    }
  });

// level cards
document
  .getElementById("explorer-level-card")
  .addEventListener("click", function () {
    currentLevel = 1;
    document.getElementById("explorer-level-card").classList.add("selected");
    document
      .getElementById("astronaut-level-card")
      .classList.remove("selected");
    document
      .getElementById("scientist-level-card")
      .classList.remove("selected");
  });

document
  .getElementById("astronaut-level-card")
  .addEventListener("click", function () {
    currentLevel = 2;
    document.getElementById("astronaut-level-card").classList.add("selected");
    document.getElementById("explorer-level-card").classList.remove("selected");
    document
      .getElementById("scientist-level-card")
      .classList.remove("selected");
  });

document
  .getElementById("scientist-level-card")
  .addEventListener("click", function () {
    currentLevel = 3;
    document.getElementById("scientist-level-card").classList.add("selected");
    document.getElementById("explorer-level-card").classList.remove("selected");
    document
      .getElementById("astronaut-level-card")
      .classList.remove("selected");
  });

// back button
document.getElementById("back-btn").addEventListener("click", function () {
  if (currentStep === 2) {
    goToStep(1);
  } else if (currentStep === 3) {
    goToStep(2);
  }
});

// continue button
document.getElementById("continue-btn").addEventListener("click", function () {
  if (currentStep === 2) {
    goToStep(3);
  }
});

// launch game button
document
  .getElementById("launch-game-btn")
  .addEventListener("click", function () {
    buildTeams();
    loadMythsVisited();
    startGame();
  });

// ******************** MAIN MENU BUTTONS ********************

document.querySelectorAll(".main-menu-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    clearInterval(timerInterval);
    score = 0;
    answeredCorrectly = 0;
    currentQuestionIndex = 0;
    questionsInRound = [];
    isAnswered = false;
    selectedTeamIndex = null;
    selectedAnswer = null;
    teams = [];
    document.getElementById("winner-animation").classList.add("hidden");
    document.getElementById("winner-animation").classList.remove("animating");
    showScreen("launch-screen");
    goToStep(1);
  });
});

// ******************** BUILD TEAMS ********************

function buildTeams() {
  teams = [];
  const teamOneInput = document.getElementById("team-one");
  const teamTwoInput = document.getElementById("team-two");
  const teamThreeInput = document.getElementById("team-three");
  const teamFourInput = document.getElementById("team-four");

  teams.push({ name: teamOneInput.value || "Team Nebula", score: 0 });
  teams.push({ name: teamTwoInput.value || "Team Pulsar", score: 0 });

  if (!teamThreeInput.classList.contains("hidden")) {
    teams.push({ name: teamThreeInput.value || "Team Saturn", score: 0 });
  }
  if (!teamFourInput.classList.contains("hidden")) {
    teams.push({ name: teamFourInput.value || "Team Neptune", score: 0 });
  }
}

// ******************** LOCAL STORAGE ********************

function loadHighScore() {
  const saved = localStorage.getItem(
    "cosmicrae-myths-highscore-" + currentLevel,
  );
  if (saved) {
    return parseInt(saved);
  }
  return 0;
}

function saveHighScore(finalScore) {
  const previousBest = loadHighScore();
  if (finalScore > previousBest) {
    localStorage.setItem(
      "cosmicrae-myths-highscore-" + currentLevel,
      finalScore,
    );
    return true;
  }
  return false;
}

function loadMythsVisited() {
  const saved = localStorage.getItem("cosmicrae-myths-visited");
  if (saved) {
    mythsVisited = JSON.parse(saved);
  } else {
    mythsVisited = [];
  }
}

function saveMythsVisited() {
  localStorage.setItem("cosmicrae-myths-visited", JSON.stringify(mythsVisited));
}

function loadGalleryViewed() {
  const saved = localStorage.getItem("cosmicrae-gallery-viewed");
  if (saved) {
    galleryViewed = JSON.parse(saved);
  } else {
    galleryViewed = [];
  }
}

function saveGalleryViewed() {
  localStorage.setItem(
    "cosmicrae-gallery-viewed",
    JSON.stringify(galleryViewed),
  );
}

// ******************** SHUFFLE ********************

function shuffleMyths(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
}

// ******************** START GAME ********************

function startGame() {
  const levelMyths = [];
  for (let i = 0; i < allMyths.length; i++) {
    if (allMyths[i].difficulty === currentLevel) {
      levelMyths.push(allMyths[i]);
    }
  }

  const shuffled = shuffleMyths(levelMyths);
  questionsInRound = [];
  for (let i = 0; i < 10; i++) {
    questionsInRound.push(shuffled[i]);
  }

  currentQuestionIndex = 0;
  score = 0;
  answeredCorrectly = 0;
  isAnswered = false;
  selectedTeamIndex = null;
  selectedAnswer = null;

  setupQuizScreen();
  showScreen("quiz-screen");
  renderQuestion();
}

// ******************** QUIZ SCREEN ********************

function setupQuizScreen() {
  const isGroup = gameMode === "group" || gameMode === "classroom";

  if (isGroup) {
    document.getElementById("solo-score").classList.add("hidden");
    document.getElementById("team-scoreboard").classList.remove("hidden");
    document
      .getElementById("team-select-instruction")
      .classList.remove("hidden");
    document.getElementById("team-answer-selection").classList.remove("hidden");
    document.getElementById("submit-btn").classList.remove("hidden");
    renderTeamButtons();
    renderScoreboard();
  } else {
    document.getElementById("solo-score").classList.remove("hidden");
    document.getElementById("team-scoreboard").classList.add("hidden");
    document.getElementById("team-answer-selection").classList.add("hidden");
    document.getElementById("submit-btn").classList.add("hidden");
    document.getElementById("team-select-instruction").classList.add("hidden");
  }

  if (currentLevel === 1) {
    document.getElementById("level-badge").textContent = "EXPLORER";
  } else if (currentLevel === 2) {
    document.getElementById("level-badge").textContent = "ASTRONAUT";
  } else {
    document.getElementById("level-badge").textContent = "SCIENTIST";
  }
}

function renderTeamButtons() {
  const container = document.getElementById("team-answer-selection");
  container.innerHTML = "";

  for (let i = 0; i < teams.length; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("team-select-btn");
    btn.textContent = teams[i].name;
    btn.dataset.teamIndex = i;
    btn.addEventListener("click", function () {
      selectTeam(i);
    });
    container.appendChild(btn);
  }
}

function selectTeam(index) {
  selectedTeamIndex = index;

  const teamBtns = document.querySelectorAll(".team-select-btn");
  for (let i = 0; i < teamBtns.length; i++) {
    teamBtns[i].classList.remove("selected");
  }
  teamBtns[index].classList.add("selected");

  const answerBtns = document.querySelectorAll(".answer-btn");
  for (let i = 0; i < answerBtns.length; i++) {
    answerBtns[i].disabled = false;
  }
}

function renderScoreboard() {
  const ranking = document.getElementById("ranking");
  ranking.innerHTML = "";

  const sorted = [...teams].sort(function (a, b) {
    return b.score - a.score;
  });

  for (let i = 0; i < sorted.length; i++) {
    const row = document.createElement("div");
    row.classList.add("scoreboard-row");
    row.innerHTML = `
      <span class="rank">${i + 1}</span>
      <span class="team-name">${sorted[i].name}</span>
      <span class="team-score ${i === 0 ? "leading" : ""}">${sorted[i].score} PTS</span>
    `;
    ranking.appendChild(row);
  }
}

function renderQuestion() {
  const question = questionsInRound[currentQuestionIndex];
  isAnswered = false;
  selectedTeamIndex = null;
  selectedAnswer = null;

  document.getElementById("statement").textContent =
    '"' + question.statement + '"';
  document.getElementById("solo-score").textContent = "Score: " + score;
  document.getElementById("question-counter").textContent =
    currentQuestionIndex + 1 + " / " + questionsInRound.length;

  const answerBtns = document.querySelectorAll(".answer-btn");
  for (let i = 0; i < answerBtns.length; i++) {
    answerBtns[i].classList.remove("selected");
    if (gameMode === "group" || gameMode === "classroom") {
      answerBtns[i].disabled = true;
    } else {
      answerBtns[i].disabled = false;
    }
  }

  if (gameMode === "group" || gameMode === "classroom") {
    const teamBtns = document.querySelectorAll(".team-select-btn");
    for (let i = 0; i < teamBtns.length; i++) {
      teamBtns[i].classList.remove("selected");
    }
    document.getElementById("submit-btn").disabled = true;
  }

  startTimer();
}

// ******************** TIMER ********************

function updateTimerColor() {
  const timerEl = document.getElementById("timer");
  const clockFill = document.getElementById("clock-fill");

  if (timeRemaining > 30) {
    timerEl.style.color = "var(--cyan)";
    if (clockFill) {
      clockFill.style.stroke = "var(--cyan)";
    }
  } else if (timeRemaining > 10) {
    timerEl.style.color = "var(--gold)";
    if (clockFill) {
      clockFill.style.stroke = "var(--gold)";
    }
  } else {
    timerEl.style.color = "var(--red)";
    if (clockFill) {
      clockFill.style.stroke = "var(--red)";
    }
  }
}

function updateClockFill() {
  const clockFill = document.getElementById("clock-fill");
  if (!clockFill) return;

  const circumference = 263.9;
  const progress = timeRemaining / 60;
  const offset = circumference - progress * circumference;
  clockFill.style.strokeDashoffset = offset;
}

function startTimer() {
  clearInterval(timerInterval);
  timeRemaining = 60;

  const clockFill = document.getElementById("clock-fill");
  if (clockFill) {
    clockFill.style.strokeDasharray = 263.9;
    clockFill.style.strokeDashoffset = 0;
  }

  document.getElementById("timer").textContent = timeRemaining + "s";
  updateTimerColor();
  updateClockFill();

  timerInterval = setInterval(function () {
    timeRemaining--;
    document.getElementById("timer").textContent = timeRemaining + "s";
    updateTimerColor();
    updateClockFill();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      playTimerSound();
      if (!isAnswered) {
        isAnswered = true;
        showReveal(false, 0);
      }
    }
  }, 1000);
}

// ******************** ANSWER BUTTONS ********************

document.querySelectorAll(".answer-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (isAnswered) return;

    selectedAnswer = btn.dataset.answer;

    document.querySelectorAll(".answer-btn").forEach(function (b) {
      b.classList.remove("selected");
    });
    btn.classList.add("selected");

    if (gameMode === "group" || gameMode === "classroom") {
      if (selectedTeamIndex !== null && selectedAnswer !== null) {
        document.getElementById("submit-btn").disabled = false;
      }
    } else {
      submitAnswer();
    }
  });
});

document.getElementById("submit-btn").addEventListener("click", function () {
  if (isAnswered) return;
  submitAnswer();
});

function submitAnswer() {
  clearInterval(timerInterval);
  isAnswered = true;

  const question = questionsInRound[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.answer;

  if (!mythsVisited.includes(question.id)) {
    mythsVisited.push(question.id);
    saveMythsVisited();
  }

  if (isCorrect) {
    answeredCorrectly++;
    const points = 100;
    playCorrectSound();

    if (gameMode === "solo") {
      score += points;
    } else {
      teams[selectedTeamIndex].score += points;
      renderScoreboard();
    }
    showReveal(true, points);
  } else {
    playWrongSound();
    showReveal(false, 0);
  }
}

// ******************** REVEAL SCREEN ********************

function showReveal(isCorrect, points) {
  showScreen("reveal-screen");

  const question = questionsInRound[currentQuestionIndex];
  const checkX = document.getElementById("check-x");

  if (isCorrect) {
    checkX.innerHTML = `
      <div class="result-icon correct-icon">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M12 30l12 12 24-24" stroke="#22c55e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
  } else {
    checkX.innerHTML = `
      <div class="result-icon wrong-icon">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M15 15l30 30M45 15L15 45" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
        </svg>
      </div>
    `;
  }

  checkX.classList.remove("animate");
  setTimeout(function () {
    checkX.classList.add("animate");
  }, 10);

  if (isCorrect) {
    document.getElementById("answer-correct-incorrect").textContent =
      "CORRECT!";
    document.getElementById("answer-correct-incorrect").className =
      "correct-word";
  } else {
    document.getElementById("answer-correct-incorrect").textContent = "WRONG!";
    document.getElementById("answer-correct-incorrect").className =
      "wrong-word";
  }

  document.getElementById("repeat-statement").textContent =
    '"' + question.statement + '"';

  if (question.answer === "myth") {
    document.getElementById("its-a-myth-fact").textContent = "It's a myth!";
    document.getElementById("its-a-myth-fact").className =
      "truth-label truth-myth";
  } else {
    document.getElementById("its-a-myth-fact").textContent = "It's a fact!";
    document.getElementById("its-a-myth-fact").className =
      "truth-label truth-fact";
  }

  document.getElementById("answer-explanation").textContent =
    question.explanation;

  const pointsEl = document.getElementById("points-awarded");
  if (isCorrect && points > 0) {
    if (gameMode === "solo") {
      pointsEl.textContent = "+" + points + " points";
    } else {
      pointsEl.textContent =
        teams[selectedTeamIndex].name + " earns +" + points + " points";
    }
  } else {
    pointsEl.textContent = "No points awarded";
  }
}

document.getElementById("next-question").addEventListener("click", function () {
  currentQuestionIndex++;

  if (currentQuestionIndex < questionsInRound.length) {
    showScreen("quiz-screen");
    renderQuestion();
  } else {
    showResults();
  }
});

// ******************** RESULTS SCREEN ********************

function showResults() {
  showScreen("results-screen");

  const accuracy = Math.round(
    (answeredCorrectly / questionsInRound.length) * 100,
  );
  document.getElementById("number-correct").textContent =
    answeredCorrectly + " / " + questionsInRound.length + " correct";
  document.getElementById("accuracy").textContent = accuracy + "% accuracy";

  if (gameMode === "solo") {
    showSoloResults();
  } else {
    showGroupResults();
  }
}

function showSoloResults() {
  document.getElementById("solo-score-banner").classList.remove("hidden");
  document.getElementById("winner-banner").classList.add("hidden");
  document.getElementById("final-scoreboard").classList.add("hidden");
  document.getElementById("winner-animation").classList.add("hidden");
  document
    .getElementById("final-solo-score-animation")
    .classList.remove("hidden");

  document.getElementById("final-solo-score").textContent = score;

  const isNewBest = saveHighScore(score);
  const personalBestEl = document.getElementById("personal-best");

  if (isNewBest) {
    personalBestEl.textContent = "New personal best!";
    personalBestEl.classList.add("new-best");
  } else {
    const best = loadHighScore();
    personalBestEl.textContent = "Personal best: " + best;
    personalBestEl.classList.remove("new-best");
  }
}

function showGroupResults() {
  document.getElementById("solo-score-banner").classList.add("hidden");
  document.getElementById("winner-banner").classList.remove("hidden");
  document.getElementById("final-scoreboard").classList.remove("hidden");
  document.getElementById("winner-animation").classList.remove("hidden");
  document.getElementById("final-solo-score-animation").classList.add("hidden");

  const sorted = [...teams].sort(function (a, b) {
    return b.score - a.score;
  });

  const winner = sorted[0];

  document.getElementById("winning-team").textContent = winner.name;
  document.getElementById("winning-score").textContent =
    winner.score + " points";

  const finalRanking = document.getElementById("final-ranking");
  finalRanking.innerHTML = "";

  for (let i = 0; i < sorted.length; i++) {
    const row = document.createElement("div");
    row.classList.add("final-rank-row");
    row.innerHTML = `
      <span class="rank">${i + 1}</span>
      <span class="team-name">${sorted[i].name}</span>
      <span class="team-score ${i === 0 ? "gold" : ""}">${sorted[i].score} PTS</span>
    `;
    finalRanking.appendChild(row);
  }

  triggerWinnerAnimation(winner.name);
}

function triggerWinnerAnimation(winnerName) {
  const overlay = document.getElementById("winner-animation");
  overlay.innerHTML = "";

  const label = document.createElement("div");
  label.classList.add("winner-overlay-text");
  label.textContent = "WINNER";
  overlay.appendChild(label);

  const name = document.createElement("div");
  name.classList.add("winner-overlay-name");
  name.textContent = winnerName;
  overlay.appendChild(name);

  for (let i = 1; i <= 15; i++) {
    const star = document.createElement("div");
    star.classList.add("burst-star", "star-" + i);
    overlay.appendChild(star);
  }

  overlay.classList.add("animating");
}

document.getElementById("play-again").addEventListener("click", function () {
  score = 0;
  answeredCorrectly = 0;
  currentQuestionIndex = 0;
  questionsInRound = [];
  isAnswered = false;
  selectedTeamIndex = null;
  selectedAnswer = null;
  teams = [];
  document.getElementById("winner-animation").classList.add("hidden");
  document.getElementById("winner-animation").classList.remove("animating");
  showScreen("launch-screen");
  goToStep(1);
});

document.getElementById("explore-btn").addEventListener("click", function () {
  showScreen("gallery-screen");
  renderGallery();
});

// ******************** GALLERY ********************

function renderGallery() {
  window.scrollTo(0, 0);
  loadGalleryViewed();

  const explorerContainer = document.getElementById(
    "explorer-level-statements",
  );
  const astronautContainer = document.getElementById(
    "astronaut-level-statements",
  );
  const scientistContainer = document.getElementById(
    "scientist-level-statements",
  );

  explorerContainer.innerHTML = "";
  astronautContainer.innerHTML = "";
  scientistContainer.innerHTML = "";

  for (let i = 0; i < allMyths.length; i++) {
    const myth = allMyths[i];
    const isViewed = galleryViewed.includes(myth.id);

    const card = document.createElement("div");
    card.classList.add("gallery-card");
    card.dataset.mythId = myth.id;

    if (isViewed) {
      card.classList.add("viewed");
      card.innerHTML = `
        <div class="viewed-checkmark">✓</div>
        <div class="gallery-level-tag">Level: ${getLevelName(myth.difficulty)}</div>
        <p class="gallery-statement">${myth.statement}</p>
      `;
    } else {
      card.innerHTML = `
        <div class="gallery-level-tag">Level: ${getLevelName(myth.difficulty)}</div>
        <p class="gallery-statement">${myth.statement}</p>
      `;
    }

    card.addEventListener("click", function () {
      openLightbox(myth);
    });

    if (myth.difficulty === 1) {
      explorerContainer.appendChild(card);
    } else if (myth.difficulty === 2) {
      astronautContainer.appendChild(card);
    } else {
      scientistContainer.appendChild(card);
    }
  }

  updateViewedCount();
}

function getLevelName(difficulty) {
  if (difficulty === 1) return "Explorer";
  if (difficulty === 2) return "Astronaut";
  return "Scientist";
}

function updateViewedCount() {
  document.getElementById("viewed-count").textContent =
    galleryViewed.length + " / 60 viewed";
}

function setupFilterButtons() {
  const filterBtns = document.querySelectorAll(".filter-buttons");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      const level = btn.dataset.level;

      if (level === "all") {
        document.getElementById("level-explorer").style.display = "block";
        document.getElementById("level-astronaut").style.display = "block";
        document.getElementById("level-scientist").style.display = "block";
      } else if (level === "explorer") {
        document.getElementById("level-explorer").style.display = "block";
        document.getElementById("level-astronaut").style.display = "none";
        document.getElementById("level-scientist").style.display = "none";
      } else if (level === "astronaut") {
        document.getElementById("level-explorer").style.display = "none";
        document.getElementById("level-astronaut").style.display = "block";
        document.getElementById("level-scientist").style.display = "none";
      } else if (level === "scientist") {
        document.getElementById("level-explorer").style.display = "none";
        document.getElementById("level-astronaut").style.display = "none";
        document.getElementById("level-scientist").style.display = "block";
      }
    });
  });
}

document
  .getElementById("back-to-menu-button")
  .addEventListener("click", function () {
    showScreen("launch-screen");
    goToStep(1);
  });

document
  .getElementById("back-to-menu-button-top")
  .addEventListener("click", function () {
    showScreen("launch-screen");
    goToStep(1);
  });

// ******************** LIGHTBOX ********************

function openLightbox(myth) {
  window.scrollTo(0, 0);
  currentLightboxMyth = myth;

  document.getElementById("level-label").textContent =
    "Level: " + getLevelName(myth.difficulty);
  document.getElementById("level-statement").textContent = myth.statement;
  document.getElementById("lightbox-reveal").classList.add("hidden");
  document.getElementById("myth-lightbox-button").disabled = false;
  document.getElementById("fact-lightbox-button").disabled = false;
  document.getElementById("lightbox-screen").classList.remove("hidden");

  if (!galleryViewed.includes(myth.id)) {
    galleryViewed.push(myth.id);
    saveGalleryViewed();
    updateViewedCount();

    const card = document.querySelector('[data-myth-id="' + myth.id + '"]');
    if (card) {
      card.classList.add("viewed");
      if (!card.querySelector(".viewed-checkmark")) {
        const checkmark = document.createElement("div");
        checkmark.classList.add("viewed-checkmark");
        checkmark.textContent = "✓";
        card.prepend(checkmark);
      }
    }
  }
}

document
  .getElementById("myth-lightbox-button")
  .addEventListener("click", function () {
    revealLightboxAnswer("myth");
  });

document
  .getElementById("fact-lightbox-button")
  .addEventListener("click", function () {
    revealLightboxAnswer("fact");
  });

function revealLightboxAnswer(chosen) {
  const myth = currentLightboxMyth;
  const isCorrect = chosen === myth.answer;

  const answerEl = document.getElementById("lightbox-answer");
  if (isCorrect) {
    answerEl.textContent = "Correct! It's a " + myth.answer + "!";
    answerEl.className = "lightbox-answer-correct";
  } else {
    answerEl.textContent = "Not quite! It's a " + myth.answer + "!";
    answerEl.className = "lightbox-answer-wrong";
  }

  document.getElementById("lightbox-explanation").textContent =
    myth.explanation;
  document.getElementById("lightbox-reveal").classList.remove("hidden");
  document.getElementById("myth-lightbox-button").disabled = true;
  document.getElementById("fact-lightbox-button").disabled = true;
}

document.getElementById("next-lightbox").addEventListener("click", function () {
  const unviewed = [];
  for (let i = 0; i < allMyths.length; i++) {
    if (!galleryViewed.includes(allMyths[i].id)) {
      unviewed.push(allMyths[i]);
    }
  }

  let pool = unviewed;
  if (unviewed.length === 0) {
    pool = allMyths;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  openLightbox(pool[randomIndex]);
});

document
  .getElementById("close-lightbox")
  .addEventListener("click", function () {
    document.getElementById("lightbox-screen").classList.add("hidden");
  });

// ******************** AUDIO ********************

function playTimerSound() {
  const sound = new Audio("../../assets/audio/timer-end.mp3");
  sound.play().catch(function () {});
}

function playCorrectSound() {
  const sound = new Audio("../../assets/audio/correct.mp3");
  sound.play().catch(function () {});
}

function playWrongSound() {
  const sound = new Audio("../../assets/audio/wrong.mp3");
  sound.play().catch(function () {});
}

// ******************** INIT ********************

async function init() {
  await getStatements();
  goToStep(1);
  updateProgressIndicator();
  loadMythsVisited();
  loadGalleryViewed();
  setupFilterButtons();
}

init();
