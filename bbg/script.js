// --- BASE COLORS FOR MEMORY GAME ---
const BASE_COLORS = [
    '#e74c3c', // Red
    '#2ecc71', // Green
    '#3498db', // Blue
    '#f1c40f', // Yellow
    '#9b59b6', // Purple
    '#e67e22', // Orange
    '#1abc9c'  // Cyan
];

// --- NAVIGATION ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('menu').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}

function showMenu() {
    stopMathGame();
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('menu').classList.remove('hidden');
}

// --- GAME 1: MEMORY MATRIX LOGIC ---
let memoryGridSize = 3;
let memoryWaitTime = 3;
let originalPattern = [];
let userPattern = [];
let memoryStep = 'memorize'; // 'memorize', 'waiting', 'reconstruct', 'review'
let availableColors = [];

function getPalette(size) {
    let count = 3 + Math.floor((size - 1) / 4);
    return BASE_COLORS.slice(0, Math.min(count, BASE_COLORS.length));
}

function startMemoryGame() {
    memoryGridSize = parseInt(document.getElementById('grid-size').value) || 3;
    memoryWaitTime = parseInt(document.getElementById('wait-time').value) || 3;
    availableColors = getPalette(memoryGridSize);

    originalPattern = [];
    userPattern = [];
    memoryStep = 'memorize';

    const gridContainer = document.getElementById('memory-grid');
    gridContainer.style.gridTemplateColumns = `repeat(${memoryGridSize}, 1fr)`;
    gridContainer.innerHTML = '';

    // Generate random layout
    for (let i = 0; i < memoryGridSize * memoryGridSize; i++) {
        let randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        originalPattern.push(randomColor);
        userPattern.push('#808080'); 

        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.backgroundColor = randomColor;
        cell.dataset.index = i;
        gridContainer.appendChild(cell);
    }

    document.getElementById('memory-status').innerText = 'Memorize the pattern!';
    document.getElementById('timer-display').classList.add('hidden');
    
    let btn = document.getElementById('memory-action-btn');
    btn.innerText = 'Ready';
    btn.disabled = false;

    showScreen('memory-game-screen');
}

function handleMemoryAction() {
    if (memoryStep === 'memorize') {
        memoryStep = 'waiting';
        document.getElementById('memory-status').innerText = 'Please wait...';
        
        const cells = document.querySelectorAll('#memory-grid .cell');
        cells.forEach(c => c.style.backgroundColor = '#333');

        document.getElementById('memory-action-btn').disabled = true;
        let countdownElem = document.getElementById('countdown');
        let timerDisplay = document.getElementById('timer-display');
        
        timerDisplay.classList.remove('hidden');
        let timeLeft = memoryWaitTime;
        countdownElem.innerText = timeLeft;

        let interval = setInterval(() => {
            timeLeft--;
            countdownElem.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(interval);
                startReconstruction();
            }
        }, 1000);
    } 
    else if (memoryStep === 'reconstruct') {
        revealErrorsAndResults();
    } 
    else if (memoryStep === 'review') {
        showScreen('memory-setup-screen');
    }
}

function startReconstruction() {
    memoryStep = 'reconstruct';
    document.getElementById('memory-status').innerText = 'Reconstruct the colors!';
    document.getElementById('timer-display').classList.add('hidden');
    
    let btn = document.getElementById('memory-action-btn');
    btn.disabled = false;
    btn.innerText = 'Submit Result';

    const cells = document.querySelectorAll('#memory-grid .cell');
    
    userPattern = new Array(memoryGridSize * memoryGridSize).fill('#808080');
    cells.forEach(c => c.style.backgroundColor = '#808080');

    cells.forEach(cell => {
        cell.onclick = () => {
            if (memoryStep !== 'reconstruct') return;
            
            let idx = cell.dataset.index;
            let currentColor = userPattern[idx];
            let colorIdx = availableColors.indexOf(currentColor);

            let nextColorIdx = (colorIdx + 1) % availableColors.length;
            let nextColor = availableColors[nextColorIdx];

            userPattern[idx] = nextColor;
            cell.style.backgroundColor = nextColor;
        };
    });
}

function revealErrorsAndResults() {
    memoryStep = 'review';
    let correctCount = 0;
    let total = memoryGridSize * memoryGridSize;
    const cells = document.querySelectorAll('#memory-grid .cell');

    cells.forEach((cell, i) => {
        cell.onclick = null; // Отключаем клики
        
        if (userPattern[i] === originalPattern[i]) {
            correctCount++;
            cell.classList.add('correct');
        } else {
            cell.classList.add('wrong');
            
            // Добавляем маленький кружочек с правильным цветом прямо поверх ячейки
            let hint = document.createElement('div');
            hint.className = 'target-color-hint';
            hint.style.backgroundColor = originalPattern[i];
            cell.appendChild(hint);
        }
    });

    let accuracy = Math.round((correctCount / total) * 100);
    document.getElementById('memory-status').innerText = `Accuracy: ${accuracy}% (${correctCount}/${total})`;
    document.getElementById('memory-action-btn').innerText = 'Play Again';
}


// --- GAME 2: SPEED MATH LOGIC ---
let mathTimerInterval = null;
let mathTime = 0;
let mathScore = 0;
let currentEquation = { a: 0, b: 0, op: '+', answer: 0 };
let userMathInput = '';
let isMathRunning = false;

function toggleMathGame() {
    if (!isMathRunning) {
        startMathGame();
    } else {
        stopMathGame();
    }
}

function startMathGame() {
    isMathRunning = true;
    mathTime = 0;
    mathScore = 0;
    userMathInput = '';
    
    document.getElementById('math-score').innerText = mathScore;
    document.getElementById('math-start-btn').innerText = 'Stop Game';
    
    mathTimerInterval = setInterval(() => {
        mathTime += 0.1;
        document.getElementById('math-timer').innerText = mathTime.toFixed(1);
    }, 100);

    generateEquation();
}

function stopMathGame() {
    isMathRunning = false;
    clearInterval(mathTimerInterval);
    document.getElementById('math-start-btn').innerText = 'Start Game';
    document.getElementById('math-equation').innerText = 'Game Over!';
    document.getElementById('math-input').innerText = `Score: ${mathScore}`;
}

function generateEquation() {
    let isAddition = Math.random() > 0.5;
    let a, b, answer;

    if (isAddition) {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        answer = a + b;
    } else {
        a = Math.floor(Math.random() * 20) + 5;
        b = Math.floor(Math.random() * a) + 1;
        answer = a - b;
    }

    currentEquation = { a, b, op: isAddition ? '+' : '-', answer };
    document.getElementById('math-equation').innerText = `${a} ${currentEquation.op} ${b}`;
    userMathInput = '';
    updateMathInputDisplay();
}

function appendMathInput(char) {
    if (!isMathRunning) return;
    if (userMathInput.length < 5) {
        userMathInput += char;
        updateMathInputDisplay();
    }
}

function clearMathInput() {
    if (!isMathRunning) return;
    userMathInput = userMathInput.slice(0, -1);
    updateMathInputDisplay();
}

function updateMathInputDisplay() {
    document.getElementById('math-input').innerText = userMathInput || '_';
}

function submitMathAnswer() {
    if (!isMathRunning) return;

    if (parseInt(userMathInput) === currentEquation.answer) {
        mathScore++;
        mathTime = Math.max(0, mathTime - 1.0);
        document.getElementById('math-score').innerText = mathScore;
        document.getElementById('math-timer').innerText = mathTime.toFixed(1);
        generateEquation();
    } else {
        let display = document.getElementById('math-input');
        display.style.color = '#e74c3c';
        setTimeout(() => display.style.color = '#ffffff', 300);
    }
}
