const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const words = ['PEZ', 'GIMNASIO', 'PERRO', 'FLOR', 'BICICLETA', 'BALON', 'MARIPOSA', 'CUADRO', 'MONTAÑA', 'TEATRO', 'TELEVISION', 'CASCADA', 'CALENDARIO', 'VENTANA', 'LLUVIA'];
let chosenWord = words[Math.floor(Math.random() * words.length)];
const wordDisplay = document.getElementById('wordDisplay');
const guessesDisplay = document.getElementById('guessesDisplay');
const letterButtonsDiv = document.getElementById('letterButtons');
const messageDiv = document.getElementById('message');
const attemptsRemainingDiv = document.getElementById('attemptsRemaining');
const letterButtons = document.querySelectorAll('.letterButton');
const restartButton = document.getElementById('restartButton');
let guessedLetters = [];
let wrongAttempts = 0;
let usedLetters = {};
let attemptsRemaining = 7;
let gameEnded = false;

function drawHangman() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(100, 400);
    ctx.lineTo(300, 400); 
    ctx.moveTo(215, 50);
    ctx.lineTo(215, 100); 
    ctx.stroke();

    if (wrongAttempts >= 1) {
        ctx.beginPath();
        ctx.arc(215, 140, 40, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (wrongAttempts >= 2) {
        ctx.beginPath();
        ctx.moveTo(215, 180);
        ctx.lineTo(215, 300);
        ctx.stroke();
    }
    if (wrongAttempts >= 3) {
        ctx.beginPath();
        ctx.moveTo(215, 200);
        ctx.lineTo(165, 250);
        ctx.stroke();
    }
    if (wrongAttempts >= 4) {
        ctx.beginPath();
        ctx.moveTo(215, 200);
        ctx.lineTo(265, 250);
        ctx.stroke();
    }
    if (wrongAttempts >= 5) {
        ctx.beginPath();
        ctx.moveTo(215, 300);
        ctx.lineTo(165, 350);
        ctx.stroke();
    }
    if (wrongAttempts >= 6) {
        ctx.beginPath();
        ctx.moveTo(215, 300);
        ctx.lineTo(265, 350);
        ctx.stroke();
    }
    if (wrongAttempts >= 7) {
        ctx.beginPath();
        ctx.moveTo(195, 120);
        ctx.lineTo(235, 160);
        ctx.moveTo(195, 160);
        ctx.lineTo(235, 120);
        ctx.stroke();
    }
}

function updateWordDisplay() {
    let display = '';
    for (const letter of chosenWord) {
        if (guessedLetters.includes(letter)) {
            display += letter;
        } else {
            display += ' _ ';
        }
    }
    wordDisplay.textContent = display;
}

function updateGuessesDisplay() {
    const incorrectGuesses = guessedLetters.filter(letter => !chosenWord.includes(letter));
    guessesDisplay.textContent = `Letras incorrectas: ${incorrectGuesses.join(', ')}`;
}

function guessLetter(letter) {
    if (!gameEnded && !usedLetters[letter]) {
        usedLetters[letter] = true; 
        if (!guessedLetters.includes(letter)) {
            guessedLetters.push(letter);
            if (!chosenWord.includes(letter)) {
                wrongAttempts++;
                attemptsRemaining--; 
                attemptsRemainingDiv.textContent = `Intentos restantes: ${attemptsRemaining}`; 
                drawHangman();
            }
            updateWordDisplay();
            updateGuessesDisplay();
            if (wrongAttempts === 7) {
                showResultMessage(false);
            } else if (!wordDisplay.textContent.includes('_')) {
                showResultMessage(true);
            }
        }
    }
    updateLetterButtons();
}

function updateLetterButtons() {
    letterButtons.forEach(button => {
        button.disabled = usedLetters[button.textContent] || gameEnded; // Corrección aquí
        button.removeEventListener('click', () => guessLetter(button.textContent)); // Remover el event listener
    });

    if (!gameEnded) {
        letterButtons.forEach(button => {
            if (!usedLetters[button.textContent]) {
                button.addEventListener('click', () => guessLetter(button.textContent)); // Volver a agregar el event listener
            }
        });
    }
}

function showResultMessage(isWin) {
    gameEnded = true; 
    messageDiv.style.display = 'block'; 
    messageDiv.textContent = isWin ? '¡GANASTE!' : '¡PERDISTE! La palabra era: ' + chosenWord;
    messageDiv.className = isWin ? '' : 'lose'; 
}

function restartGame() {
    guessedLetters = [];
    wrongAttempts = 0;
    usedLetters = {};
    attemptsRemaining = 7;
    gameEnded = false;

    messageDiv.style.display = 'none';

    attemptsRemainingDiv.textContent = `Intentos restantes: ${attemptsRemaining}`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    chosenWord = words[Math.floor(Math.random() * words.length)];

    updateWordDisplay();
    updateGuessesDisplay();

    updateLetterButtons();
}

drawHangman();
updateWordDisplay();
updateGuessesDisplay();

letterButtons.forEach(button => {
    button.addEventListener('click', () => guessLetter(button.textContent));
});

document.addEventListener('keydown', (event) => {
    const letter = event.key.toUpperCase();
    if (letter.match(/[A-Z]/) && !usedLetters[letter] && !gameEnded) {
        guessLetter(letter);
    }
});

restartButton.addEventListener('click', restartGame);