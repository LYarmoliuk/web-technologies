const character = document.getElementById('character');
const statusText = document.getElementById('status');
const startButton = document.getElementById('start-button');
const introMusic = document.getElementById('intro-music');
const fireSound = document.getElementById('fire-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

let canShoot = false;
let fireTime = 0;
let clicked = false;
let walkInterval = null;

function setCharacterFrame(x, y) {
    character.style.backgroundPosition = `-${x * 43}px -${y * 73}px`;
}

function startGame() {
    clicked = false;
    statusText.textContent = "Герой виходить...";
    startButton.style.display = "none";
    introMusic.src = "sounds/intro.m4a";
    introMusic.play();
    
    let frame = 0;
    walkInterval = setInterval(() => {
        setCharacterFrame(frame % 11, 0); // Ходіння (перший ряд)
        frame++;
    }, 100);

    setTimeout(() => {
        clearInterval(walkInterval);
        setCharacterFrame(0, 0); // Стоїть (другий ряд)
        statusText.textContent = "Герой чекає...";
        
        const randomDelay = Math.random() * 2000 + 1000;
        setTimeout(startFire, randomDelay);
    }, 2000);
}

function startFire() {
    fireSound.play();
    statusText.textContent = "FIRE!";
    setCharacterFrame(2, 1); // Постріл (2-й ряд, 3-й кадр)
    canShoot = true;
    fireTime = Date.now();
}

character.addEventListener('click', () => {
    if (!canShoot || clicked) return;

    clicked = true;
    const reactionTime = Date.now() - fireTime;

    if (reactionTime <= 1000) {
        win();
    } else {
        lose();
    }
});

function win() {
    statusText.textContent = "Ви перемогли!";
    document.body.style.backgroundImage = "url('images/win-bg.png')";
    introMusic.pause();
    winSound.play();
    showRestart();
}

function lose() {
    statusText.textContent = "Ви програли!";
    document.body.style.backgroundImage = "url('images/bg.png')";
    introMusic.pause();
    loseSound.play();
    setCharacterFrame(3, 4); // Лежить (4-й ряд, 4-й кадр)
    showRestart();
}

function showRestart() {
    startButton.textContent = "Перезапустити";
    startButton.style.display = "block";
    canShoot = false;
}

startButton.addEventListener('click', startGame);
