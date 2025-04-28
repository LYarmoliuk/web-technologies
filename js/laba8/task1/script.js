const gameBoard = document.getElementById('gameBoard');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const resetSettingsButton = document.getElementById('resetSettings');
const playersSelect = document.getElementById('playersSelect');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const roundsInput = document.getElementById('roundsInput');
const currentPlayerName = document.getElementById('currentPlayerName');
const resultDiv = document.getElementById('result');

let symbolsBase = ['🍎', '🍌', '🍇', '🍒', '🍍', '🍑', '🥝', '🍉', '🍋', '🥥', '🍈', '🍏', '🍓', '🍅', '🍆'];
let cards = [];
let flippedCards = [];
let lockBoard = false;
let moves = 0;
let timer;
let timeLeft = 0;
let totalTime;
let currentPlayer = 1;
let players = [{name: '', moves: 0, time: 0}, {name: '', moves: 0, time: 0}];
let totalRounds = 1;
let currentRound = 1;

playersSelect.addEventListener('change', () => {
    player2Input.style.display = playersSelect.value === '2' ? 'block' : 'none';
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
resetSettingsButton.addEventListener('click', resetSettings);

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startGame() {
    document.getElementById('gameInfo').style.display = 'block';
    resultDiv.style.display = 'none';

    moves = 0;
    movesDisplay.textContent = moves;

    setupPlayers();
    setupBoard();
    setupTimer();

    currentPlayer = 1;
    currentPlayerName.textContent = players[0].name;

    restartButton.style.display = 'inline-block';
    startButton.style.display = 'none';
    resetSettingsButton.style.display = 'none';
}

function setupPlayers() {
    players = [];
    const p1 = player1Input.value || 'Гравець 1';
    players.push({name: p1, moves: 0, time: 0});

    if (playersSelect.value === '2') {
        const p2 = player2Input.value || 'Гравець 2';
        players.push({name: p2, moves: 0, time: 0});
    }
    totalRounds = parseInt(roundsInput.value) || 1;
}

function setupBoard() {
    const gridSize = document.getElementById('gridSize').value;
    const [rows, cols] = gridSize.split('x').map(Number);
    const totalCards = rows * cols;

    const neededSymbols = shuffle([...symbolsBase]).slice(0, totalCards / 2);
    cards = shuffle([...neededSymbols, ...neededSymbols]);

    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 80px)`;
    gameBoard.innerHTML = '';

    cards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.innerHTML = `<span>${symbol}</span>`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function setupTimer() {
    clearInterval(timer);
    const difficulty = document.getElementById('difficulty').value;
    if (difficulty === 'easy') timeLeft = 180;
    else if (difficulty === 'normal') timeLeft = 120;
    else timeLeft = 60;
    
    totalTime = timeLeft;
    updateTimer();
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timer);
            endRound('Час вийшов!');
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        flippedCards = [];
        checkWin();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }

    moves++;
    movesDisplay.textContent = moves;
    players[currentPlayer - 1].moves++;

    if (players.length === 2) switchPlayer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentPlayerName.textContent = players[currentPlayer - 1].name;
}

function checkWin() {
    const allFlipped = [...document.querySelectorAll('.card')].every(card => card.classList.contains('flipped'));
    if (allFlipped) {
        clearInterval(timer);
        players[currentPlayer - 1].time = totalTime - timeLeft;
        endRound('Гру завершено!');
    }
}

function endRound(message) {
    resultDiv.innerHTML = `<p>${message}</p>`;
    resultDiv.style.display = 'block';

    if (currentRound < totalRounds) {
        currentRound++;
        setTimeout(() => {
            startGame();
        }, 3000);
    } else {
        showFinalResult();
    }
}

function showFinalResult() {
    let winner;
    if (players.length === 1) {
        winner = players[0].name;
    } else {
        winner = players.reduce((a, b) => (a.moves < b.moves ? a : b)).name;
    }

    resultDiv.innerHTML = `<p>Переможець: ${winner}</p>`;
}

function restartGame() {
    startGame();
}

function resetSettings() {
    document.getElementById('difficulty').value = 'easy';
    document.getElementById('gridSize').value = '4x4';
    roundsInput.value = 1;
    player1Input.value = '';
    player2Input.value = '';
    playersSelect.value = 1;
    player2Input.style.display = 'none';
}
