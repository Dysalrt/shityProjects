// --- BASE COLORS FOR MEMORY GAME ---
const BASE_COLORS = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c'];

// --- NAVIGATION ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('menu').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}

function showMenu() {
    stopMathGame();
    stopReactionGame();
    stopTrackerGame();
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('menu').classList.remove('hidden');
}

// ==========================================
// GAME 1: MEMORY MATRIX LOGIC
// ==========================================
let memoryGridSize = 3;
let memoryWaitTime = 3;
let originalPattern = [];
let userPattern = [];
let memoryStep = 'memorize';
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
        cell.onclick = null;
        if (userPattern[i] === originalPattern[i]) {
            correctCount++;
            cell.classList.add('correct');
        } else {
            cell.classList.add('wrong');
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

// ==========================================
// GAME 2: SPEED MATH LOGIC
// ==========================================
let mathTimerInterval = null;
let mathTime = 0;
let mathScore = 0;
let currentEquation = { a: 0, b: 0, op: '+', answer: 0 };
let userMathInput = '';
let isMathRunning = false;

function toggleMathGame() {
    if (!isMathRunning) startMathGame();
    else stopMathGame();
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

// ==========================================
// GAME 3: REACTION & ACCURACY
// ==========================================
let reactGridSize = 4;
let reactDifficulty = 'easy';
let reactScore = 0;
let reactPenalty = 0;
let reactTimeoutId = null;
let activeRedCell = null;
let isReactRunning = false;

function startReactionGame() {
    reactGridSize = parseInt(document.getElementById('react-grid-size').value) || 4;
    reactDifficulty = document.getElementById('react-difficulty').value;
    
    reactScore = 0;
    reactPenalty = 0;
    isReactRunning = true;

    document.getElementById('react-score').innerText = reactScore;
    document.getElementById('react-penalty').innerText = reactPenalty;

    const gridContainer = document.getElementById('reaction-grid');
    gridContainer.style.gridTemplateColumns = `repeat(${reactGridSize}, 1fr)`;
    gridContainer.innerHTML = '';

    for (let i = 0; i < reactGridSize * reactGridSize; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.onclick = () => handleReactClick(cell);
        gridContainer.appendChild(cell);
    }

    showScreen('reaction-game-screen');
    scheduleNextRedBlock();
}

function stopReactionGame() {
    isReactRunning = false;
    clearTimeout(reactTimeoutId);
}

function scheduleNextRedBlock() {
    if (!isReactRunning) return;
    
    // Random delay between 0 and 7 seconds
    let delay = Math.random() * 7000;
    
    reactTimeoutId = setTimeout(() => {
        spawnRedBlock();
    }, delay);
}

function spawnRedBlock() {
    if (!isReactRunning) return;

    const cells = document.querySelectorAll('#reaction-grid .cell');
    let randomIndex = Math.floor(Math.random() * cells.length);
    activeRedCell = cells[randomIndex];
    activeRedCell.style.backgroundColor = '#e74c3c'; // Red

    // Optional Decoy blocks based on difficulty
    if (reactDifficulty === 'medium' || reactDifficulty === 'hardcore') {
        spawnDecoyBlock('#2ecc71', 5000); // Green (disappears in 5s)
    }
    if (reactDifficulty === 'hardcore') {
        spawnDecoyBlock('#9b59b6', 4000); // Purple penalty block
    }
}

function spawnDecoyBlock(color, duration) {
    const cells = Array.from(document.querySelectorAll('#reaction-grid .cell'))
                       .filter(c => c.style.backgroundColor === '' || c.style.backgroundColor === 'rgb(34, 34, 34)');
    
    if (cells.length === 0) return;

    let randomCell = cells[Math.floor(Math.random() * cells.length)];
    randomCell.style.backgroundColor = color;

    setTimeout(() => {
        if (randomCell.style.backgroundColor === color) {
            randomCell.style.backgroundColor = '#222';
        }
    }, duration);
}

function handleReactClick(cell) {
    if (!isReactRunning) return;

    let color = cell.style.backgroundColor;

    // Clicked Red Target
    if (cell === activeRedCell && (color === 'rgb(231, 76, 60)' || color === '#e74c3c')) {
        reactScore++;
        document.getElementById('react-score').innerText = reactScore;
        cell.style.backgroundColor = '#222';
        activeRedCell = null;
        scheduleNextRedBlock();
    }
    // Clicked Penalty Purple Block
    else if (color === 'rgb(155, 89, 182)' || color === '#9b59b6') {
        reactPenalty++;
        document.getElementById('react-penalty').innerText = reactPenalty;
        cell.style.backgroundColor = '#222';
    }
}

// ==========================================
// GAME 4: OBSERVER (TRACKER) LOGIC
// ==========================================
let trackerPos = { r: 0, c: 0 };
let trackerCurrentPos = { r: 0, c: 0 };
let trackerMoveCount = 5;
let trackerSpeed = 1;
let trackerMode = 'normal';
let trackerStep = 'setup'; // 'setup', 'moving', 'guess'

const DIRECTIONS = [
    { r: -1, c: 0, arrow: '↑' },
    { r: 1, c: 0, arrow: '↓' },
    { r: 0, c: -1, arrow: '←' },
    { r: 0, c: 1, arrow: '→' }
];

const DECOY_COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];

function startTrackerGame() {
    trackerSpeed = parseFloat(document.getElementById('track-speed').value) || 1;
    trackerMoveCount = parseInt(document.getElementById('track-moves').value) || 5;
    trackerMode = document.getElementById('track-mode').value;
    
    trackerStep = 'setup';

    const grid = document.getElementById('tracker-grid');
    grid.innerHTML = '';

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let cell = document.createElement('div');
            cell.className = 'cell arrow-cell';
            cell.dataset.r = r;
            cell.dataset.c = c;
            grid.appendChild(cell);
        }
    }

    // Set Random Initial Red Square
    trackerPos.r = Math.floor(Math.random() * 10);
    trackerPos.c = Math.floor(Math.random() * 10);
    trackerCurrentPos = { ...trackerPos };

    let startCell = getTrackerCell(trackerPos.r, trackerPos.c);
    startCell.style.backgroundColor = '#e74c3c';

    document.getElementById('tracker-status').innerText = 'Memorize starting position!';
    let btn = document.getElementById('tracker-btn');
    btn.innerText = 'Ready';
    btn.disabled = false;

    showScreen('tracker-game-screen');
}

function stopTrackerGame() {
    trackerStep = 'stopped';
}

function getTrackerCell(r, c) {
    return document.querySelector(`#tracker-grid .cell[data-r="${r}"][data-c="${c}"]`);
}

function handleTrackerAction() {
    if (trackerStep === 'setup') {
        startArrowSequence();
    } else if (trackerStep === 'finished') {
        startTrackerGame();
    }
}

async function startArrowSequence() {
    trackerStep = 'moving';
    document.getElementById('tracker-btn').disabled = true;
    document.getElementById('tracker-status').innerText = 'Track the movements!';

    // Hide initial Red square
    let startCell = getTrackerCell(trackerPos.r, trackerPos.c);
    startCell.style.backgroundColor = '#222';

    for (let i = 0; i < trackerMoveCount; i++) {
        if (trackerStep !== 'moving') return;

        // Find valid moves inside 10x10 bounds
        let validMoves = DIRECTIONS.filter(d => {
            let nr = trackerCurrentPos.r + d.r;
            let nc = trackerCurrentPos.c + d.c;
            return nr >= 0 && nr < 10 && nc >= 0 && nc < 10;
        });

        let move = validMoves[Math.floor(Math.random() * validMoves.length)];
        let targetCell = getTrackerCell(trackerCurrentPos.r, trackerCurrentPos.c);

        // Update actual internal position
        trackerCurrentPos.r += move.r;
        trackerCurrentPos.c += move.c;

        // Arrow display setup
        targetCell.innerText = move.arrow;
        targetCell.style.color = (trackerMode === 'hardcore' && Math.random() > 0.4) 
            ? DECOY_COLORS[Math.floor(Math.random() * DECOY_COLORS.length)] 
            : '#e74c3c';

        // Fade Out effect
        targetCell.style.transition = `opacity ${trackerSpeed}s ease`;
        
        await new Promise(res => setTimeout(res, 100)); // slight pause before fade
        targetCell.classList.add('fade-out');

        await new Promise(res => setTimeout(res, trackerSpeed * 1000));
        
        // Cleanup cell state
        targetCell.innerText = '';
        targetCell.classList.remove('fade-out');
        targetCell.style.transition = 'none';
    }

    enableGuessingPhase();
}

function enableGuessingPhase() {
    trackerStep = 'guess';
    document.getElementById('tracker-status').innerText = 'Select where the square is now!';

    const cells = document.querySelectorAll('#tracker-grid .cell');
    cells.forEach(cell => {
        cell.onclick = () => {
            if (trackerStep !== 'guess') return;

            let r = parseInt(cell.dataset.r);
            let c = parseInt(cell.dataset.c);

            let actualTargetCell = getTrackerCell(trackerCurrentPos.r, trackerCurrentPos.c);

            if (r === trackerCurrentPos.r && c === trackerCurrentPos.c) {
                cell.style.backgroundColor = '#2ecc71'; // Correct Green
                document.getElementById('tracker-status').innerText = 'Correct! Excellent tracking!';
            } else {
                cell.style.backgroundColor = '#e74c3c'; // Wrong Red
                actualTargetCell.style.backgroundColor = '#2ecc71'; // Highlight actual position
                document.getElementById('tracker-status').innerText = 'Wrong! Green shows actual position.';
            }

            trackerStep = 'finished';
            let btn = document.getElementById('tracker-btn');
            btn.disabled = false;
            btn.innerText = 'Play Again';
        };
    });
            }
            
