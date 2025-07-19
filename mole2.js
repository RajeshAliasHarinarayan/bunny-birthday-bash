let currMoleTile;
let currTrapTile1;
let currTrapTile2;
let score = 0;
let gameOver = false;
let timer = 30;
let countdownInterval;
let moleInterval;
let plantInterval;
let trap2Interval;

// Audio
const winSound = new Audio('./sounds/win.mp3');
const loseSound = new Audio('./sounds/gameover.mp3');
const timeupSound = new Audio('./sounds/timeup.mp3');
let resultSound;

const bonkSound = new Audio('./sounds/bonk.mp3');

const mainMenuSong = new Audio('./sounds/mainmenu.mp3');
mainMenuSong.loop = true;

const inGameSong = new Audio('./sounds/ingame.mp3');
inGameSong.loop = true;

let lastTouchTime = 0;

window.onload = function () {
  const splash = document.getElementById("splash-screen");
  const mainMenu = document.getElementById("main-menu-screen");
  const gameContainer = document.getElementById("game-container");

  const openButton = document.getElementById("open-button");
  const startButton = document.getElementById("start-button");
  const retryButton = document.getElementById("retry-button");

  openButton?.addEventListener("click", () => {
    splash.style.display = "none";
    mainMenu.style.display = "flex";

    mainMenuSong.play().catch(() => {
      console.warn("User interaction may be required to play audio.");
    });
  });

  startButton?.addEventListener("click", () => {
    mainMenu.style.display = "none";
    gameContainer.style.display = "flex";

    mainMenuSong.pause();
    mainMenuSong.currentTime = 0;

    inGameSong.currentTime = 0;
    inGameSong.playbackRate = 1.0; // reset speed
    inGameSong.play();

    initializeGame();
  });

  retryButton?.addEventListener("click", () => {
    resetGame();
  });
};

function initializeGame() {
  document.getElementById("board").innerHTML = "";

  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", handleTileSelect);
    tile.addEventListener("touchstart", handleTileSelect, { passive: true });
    document.getElementById("board").appendChild(tile);
  }

  startGame();
}

function handleTileSelect(event) {
  const now = Date.now();
  if (event.type === "touchstart") {
    lastTouchTime = now;
  } else if (event.type === "click" && now - lastTouchTime < 500) {
    return;
  }
  selectTile.call(this);
}

function startGame() {
  gameOver = false;
  score = 0;
  timer = 30;

  document.getElementById("score").innerText = score;
  document.getElementById("timer").innerText = timer;
  document.getElementById("timer").style.color = "white";

  countdownInterval = setInterval(updateTimer, 1000);
  moleInterval = setInterval(setRandomScoringCharacter, 1000);
  plantInterval = setInterval(setPlant, 1100);
  trap2Interval = setInterval(setTrap2, 1300);
}

function updateTimer() {
  if (gameOver) return;
  timer--;

  const timerElement = document.getElementById("timer");
  timerElement.innerText = timer;

  if (timer === 15) {
    timerElement.style.color = "#ff4040";
    inGameSong.playbackRate = 1.3; // increase urgency
  }

  if (timer <= 0) {
    endGame(false, true); // time-up scenario
  }
}

function getRandomTile() {
  return Math.floor(Math.random() * 9).toString();
}

function isTileOccupied(id) {
  return (
    (currMoleTile && currMoleTile.id === id) ||
    (currTrapTile1 && currTrapTile1.id === id) ||
    (currTrapTile2 && currTrapTile2.id === id)
  );
}

function setRandomScoringCharacter() {
  if (gameOver) return;
  if (currMoleTile) currMoleTile.innerHTML = "";

  const img = document.createElement("img");
  img.src = Math.random() < 0.5 ? "./images/foxmole.png" : "./images/hippomole.png";

  const num = getRandomTile();
  if (isTileOccupied(num)) return;

  currMoleTile = document.getElementById(num);
  currMoleTile.appendChild(img);
}

function setPlant() {
  if (gameOver) return;
  if (currTrapTile1) currTrapTile1.innerHTML = "";

  const plant = document.createElement("img");
  plant.src = "./images/leobishtmole.png";

  const num = getRandomTile();
  if (isTileOccupied(num)) return;

  currTrapTile1 = document.getElementById(num);
  currTrapTile1.appendChild(plant);
}

function setTrap2() {
  if (gameOver) return;
  if (currTrapTile2) currTrapTile2.innerHTML = "";

  const trap = document.createElement("img");
  trap.src = "./images/tiffymole2.png";

  const num = getRandomTile();
  if (isTileOccupied(num)) return;

  currTrapTile2 = document.getElementById(num);
  currTrapTile2.appendChild(trap);
}

function selectTile() {
  if (gameOver) return;

  if (this === currMoleTile) {
    bonkSound.currentTime = 0;
    bonkSound.play();
    score += 10;
    document.getElementById("score").innerText = score;

    if (score >= 160) {
      endGame(true);
    }
  } else if (this === currTrapTile1 || this === currTrapTile2) {
    endGame(false, false);
  }
}

function endGame(won, isTimeUp = false) {
  gameOver = true;

  clearInterval(countdownInterval);
  clearInterval(moleInterval);
  clearInterval(plantInterval);
  clearInterval(trap2Interval);

  inGameSong.pause();
  inGameSong.currentTime = 0;
  inGameSong.playbackRate = 1.0;

  for (let i = 0; i < 9; i++) {
    document.getElementById(i.toString()).innerHTML = "";
    document.getElementById(i.toString()).style.backgroundImage = "none";
  }

  const resultImage = document.getElementById("result-image");
  if (won) {
    resultImage.src = "./images/gamewon.png";
    resultSound = winSound;
  } else if (isTimeUp) {
    resultImage.src = "./images/timeup.png";
    resultSound = timeupSound;
  } else {
    resultImage.src = "./images/gameover.png";
    resultSound = loseSound;
  }

  document.getElementById("game-result-screen").style.display = "block";
  resultSound.currentTime = 0;
  resultSound.play();
  document.getElementById("retry-button").style.display = "block";
}

function resetGame() {
  if (resultSound && !resultSound.paused) {
    resultSound.pause();
    resultSound.currentTime = 0;
  }

  gameOver = false;
  score = 0;
  timer = 30;

  document.getElementById("score").innerText = "0";
  document.getElementById("timer").innerText = "30";
  document.getElementById("timer").style.color = "white";

  for (let i = 0; i < 9; i++) {
    const tile = document.getElementById(i.toString());
    tile.innerHTML = "";
    tile.style.backgroundImage = 'url("./images/pipe.png")';
  }

  currMoleTile = null;
  currTrapTile1 = null;
  currTrapTile2 = null;

  document.getElementById("game-result-screen").style.display = "none";
  document.getElementById("retry-button").style.display = "none";

  inGameSong.currentTime = 0;
  inGameSong.playbackRate = 1.0;
  inGameSong.play();

  startGame();
}
