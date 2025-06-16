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

let winSound = new Audio('./sounds/win.mp3');
let loseSound = new Audio('./sounds/gameover.mp3');
let resultSound; // Track current result sound

let bonkSound = new Audio('./sounds/bonk.mp3');


window.onload = function () {
    setGame();

    document.getElementById("retry-button").addEventListener("click", function () {
        resetGame();
    });
};

function setGame() {
    // Set up the 3x3 board once
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();

        //tile.addEventListener("click", selectTile);
        // Add both click and touch support
        tile.addEventListener("click", selectTile);
        tile.addEventListener("touchstart", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    // Start intervals
    startGame();
}

function startGame() {
    gameOver = false;
    timer = 35;
    score = 0;

    document.getElementById("score").innerText = score.toString();
    document.getElementById("timer").innerText = timer.toString();

    countdownInterval = setInterval(updateTimer, 1000);
    moleInterval = setInterval(setMole, 1000);
    hippoInterval = setInterval(setHippo, 1200);
    plantInterval = setInterval(setPlant, 2000);
}

function updateTimer() {
    if (gameOver) return;

    timer--;
    document.getElementById("timer").innerText = timer.toString();

    if (timer <= 0) {
        endGame(false); // time's up, game over
    }
}

function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

function setMole() {
    if (gameOver) return;

    if (currMoleTile) currMoleTile.innerHTML = "";

    let mole = document.createElement("img");
    mole.src = "./images/foxmole.png";

    let num = getRandomTile();
    if (isTileOccupied(num)) return;

    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setHippo() {
    if (gameOver) return;

    if (currHippoTile) currHippoTile.innerHTML = "";

    let hippo = document.createElement("img");
    hippo.src = "./images/hippomole.png";

    let num = getRandomTile();
    if (isTileOccupied(num)) return;

    currHippoTile = document.getElementById(num);
    currHippoTile.appendChild(hippo);
}

function setPlant() {
    if (gameOver) return;

    if (currPlantTile) currPlantTile.innerHTML = "";

    let plant = document.createElement("img");
    plant.src = "./images/leobishtmole.png";

    let num = getRandomTile();
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
        // Play bonk sound on hit
        bonkSound.currentTime = 0;
        bonkSound.play();
        score += 10;
        document.getElementById("score").innerText = score.toString();

        if (score >= 120) {
            endGame(true); // game won
        }
    } else if (this === currPlantTile) {
        endGame(false); // hit plant, game over
    }
}



function endGame(won) {
    gameOver = true;

    clearInterval(countdownInterval);
    clearInterval(moleInterval);
    clearInterval(hippoInterval);
    clearInterval(plantInterval);

    // Clear all tiles
    for (let i = 0; i < 9; i++) {
        document.getElementById(i.toString()).innerHTML = "";
        document.getElementById(i.toString()).style.backgroundImage = "none";
    }

    // Show result overlay with gamewon/gameover image
    const resultImage = document.getElementById("result-image");
    resultImage.src = won ? "./images/gamewon.png" : "./images/gameover.png";
    document.getElementById("game-result-screen").style.display = "block";

    // Play result sound
    resultSound = won ? winSound : loseSound;
    resultSound.currentTime = 0;
    resultSound.play();

    // Show retry button
    document.getElementById("retry-button").style.display = "block";
}


function resetGame() {

    // Stop result sound if still playing
    if (resultSound && !resultSound.paused) {
        resultSound.pause();
        resultSound.currentTime = 0;
    }

    gameOver = false;
    score = 0;
    timer = 35;

    document.getElementById("score").innerText = "0";
    document.getElementById("timer").innerText = "60";

    for (let i = 0; i < 9; i++) {
        const tile = document.getElementById(i.toString());
        tile.innerHTML = "";
        tile.style.backgroundImage = 'url("./images/pipe.png")';
    }

    currMoleTile = null;
    currHippoTile = null;
    currPlantTile = null;

    // Hide result overlay and retry button
    document.getElementById("game-result-screen").style.display = "none";
    document.getElementById("retry-button").style.display = "none";

    startGame();
}
