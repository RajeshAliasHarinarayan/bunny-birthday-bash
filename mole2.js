let currMoleTile;
let currHippoTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let timer = 35;
let countdownInterval;
let moleInterval;
let hippoInterval;
let plantInterval;

// Audio
const winSound = new Audio('./sounds/win.mp3');
const loseSound = new Audio('./sounds/gameover.mp3');
let resultSound;

const bonkSound = new Audio('./sounds/bonk.mp3');

const mainMenuSong = new Audio('./sounds/mainmenu.mp3');
mainMenuSong.loop = true;

const inGameSong = new Audio('./sounds/ingame.mp3');
inGameSong.loop = true;

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
    inGameSong.play();

    initializeGame();
  });

  retryButton?.addEventListener("click", () => {
    resetGame();
  });
};

function initializeGame() {
  // Clear previous tiles if any
  document.getElementById("board").innerHTML = "";

  // Create game board
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    tile.addEventListener("touchstart", selectTile);
    document.getElementById("board").appendChild(tile);
  }

  startGame();
}

function startGame() {
  gameOver = false;
  score = 0;
  timer = 30;

  document.getElementById("score").innerText = score;
  document.getElementById("timer").innerText = timer;

  countdownInterval = setInterval(updateTimer, 1000);
  moleInterval = setInterval(setMole, 1000);
  hippoInterval = setInterval(setHippo, 1200);
  plantInterval = setInterval(setPlant, 1200);
}

function updateTimer() {
  if (gameOver) return;

  timer--;
  document.getElementById("timer").innerText = timer;

  if (timer <= 0) {
    endGame(false); // Time's up
  }
}

function getRandomTile() {
  return Math.floor(Math.random() * 9).toString();
}

function setMole() {
  if (gameOver) return;
  if (currMoleTile) currMoleTile.innerHTML = "";

  const mole = document.createElement("img");
  mole.src = "./images/foxmole.png";

  const num = getRandomTile();
  if (isTileOccupied(num)) return;

  currMoleTile = document.getElementById(num);
  currMoleTile.appendChild(mole);
}

function setHippo() {
  if (gameOver) return;
  if (currHippoTile) currHippoTile.innerHTML = "";

  const hippo = document.createElement("img");
  hippo.src = "./images/hippomole.png";

  const num = getRandomTile();
  if (isTileOccupied(num)) return;

  currHippoTile = document.getElementById(num);
  currHippoTile.appendChild(hippo);
}

function setPlant() {
  if (gameOver) return;
  if (currPlantTile) currPlantTile.innerHTML = "";

  const plant = document.createElement("img");
  plant.src = "./images/leobishtmole.png";

  const num = getRandomTile();
  if (isTileOccupied(num)) return;

  currPlantTile = document.getElementById(num);
  currPlantTile.appendChild(plant);
}

function isTileOccupied(id) {
  return (
    (currPlantTile && currPlantTile.id === id) ||
    (currMoleTile && currMoleTile.id === id) ||
    (currHippoTile && currHippoTile.id === id)
  );
}

function selectTile() {
  if (gameOver) return;

  if (this === currMoleTile || this === currHippoTile) {
    bonkSound.currentTime = 0;
    bonkSound.play();

    score += 10;
    document.getElementById("score").innerText = score;

    if (score >= 120) {
      endGame(true); // win
    }
  } else if (this === currPlantTile) {
    endGame(false); // hit trap
  }
}

function endGame(won) {
  gameOver = true;

  clearInterval(countdownInterval);
  clearInterval(moleInterval);
  clearInterval(hippoInterval);
  clearInterval(plantInterval);

  inGameSong.pause();
  inGameSong.currentTime = 0;

  for (let i = 0; i < 9; i++) {
    document.getElementById(i.toString()).innerHTML = "";
    document.getElementById(i.toString()).style.backgroundImage = "none";
  }

  const resultImage = document.getElementById("result-image");
  resultImage.src = won ? "./images/gamewon.png" : "./images/gameover.png";
  document.getElementById("game-result-screen").style.display = "block";

  resultSound = won ? winSound : loseSound;
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

  for (let i = 0; i < 9; i++) {
    const tile = document.getElementById(i.toString());
    tile.innerHTML = "";
    tile.style.backgroundImage = 'url("./images/pipe.png")';
  }

  currMoleTile = null;
  currHippoTile = null;
  currPlantTile = null;

  document.getElementById("game-result-screen").style.display = "none";
  document.getElementById("retry-button").style.display = "none";

  inGameSong.currentTime = 0;
  inGameSong.play();

  startGame();
}
