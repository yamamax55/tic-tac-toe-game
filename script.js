let currentPlayer = 'O';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'player'; // 'player' for 2-player, 'cpu' for vs CPU
let playerSymbol = 'O'; // Player's chosen symbol
let cpuSymbol = 'X'; // CPU's symbol
let cpuDifficulty = 'hard'; // 'hard' for perfect CPU, 'easy' for easy mode

// 2人プレイ用戦績
let pvpPlayerOWins = 0;
let pvpPlayerXWins = 0;
let pvpDraws = 0;

// CPU対戦用戦績
let cpuHumanWins = 0;
let cpuWins = 0;
let cpuDraws = 0;

// Audio System
let audioContext;
let bgmEnabled = true;
let sfxEnabled = true;
let bgmOscillator = null;
let bgmGain = null;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Audio System Functions
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        startBGM();
    } catch (e) {
        console.log('Audio not supported');
        bgmEnabled = false;
        sfxEnabled = false;
    }
}

function startBGM() {
    if (!audioContext || !bgmEnabled) return;
    playBGMLoop();
}

function playBGMLoop() {
    if (!audioContext || !bgmEnabled) return;

    // Beautiful chord progression: C - Am - F - G
    const chordProgression = [
        // C Major chord
        { 
            notes: [261.63, 329.63, 392.00], // C4, E4, G4
            duration: 2000 
        },
        // A Minor chord
        { 
            notes: [220.00, 261.63, 329.63], // A3, C4, E4
            duration: 2000 
        },
        // F Major chord
        { 
            notes: [174.61, 220.00, 261.63], // F3, A3, C4
            duration: 2000 
        },
        // G Major chord
        { 
            notes: [196.00, 246.94, 293.66], // G3, B3, D4
            duration: 2000 
        }
    ];

    let chordIndex = 0;
    let currentOscillators = [];
    let currentGain = null;

    function playNextChord() {
        if (!bgmEnabled) return;

        // Stop previous chord
        currentOscillators.forEach(osc => {
            if (osc && osc.stop) {
                try {
                    osc.stop();
                } catch (e) {}
            }
        });
        currentOscillators = [];

        if (currentGain) {
            currentGain.disconnect();
        }

        // Create new gain node for this chord
        currentGain = audioContext.createGain();
        currentGain.gain.setValueAtTime(0, audioContext.currentTime);
        currentGain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.1); // Gentle fade in
        currentGain.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + chordProgression[chordIndex].duration / 1000 - 0.2); // Sustain
        currentGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + chordProgression[chordIndex].duration / 1000); // Fade out
        currentGain.connect(audioContext.destination);

        // Play each note in the chord
        chordProgression[chordIndex].notes.forEach((freq, noteIndex) => {
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            
            // Add subtle chorus effect by slightly detuning some notes
            if (noteIndex > 0) {
                oscillator.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.002), audioContext.currentTime);
            }
            
            oscillator.connect(currentGain);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + chordProgression[chordIndex].duration / 1000);
            
            currentOscillators.push(oscillator);
        });

        chordIndex = (chordIndex + 1) % chordProgression.length;

        // Schedule next chord
        setTimeout(playNextChord, chordProgression[chordIndex === 0 ? chordProgression.length - 1 : chordIndex - 1].duration);
    }

    playNextChord();
}

function stopBGM() {
    bgmEnabled = false;
    // The playNextChord function will check bgmEnabled and stop naturally
}

function playClickSound() {
    if (!audioContext || !sfxEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playWinSound() {
    if (!audioContext || !sfxEnabled) return;

    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 150);
    });
}

function playDrawSound() {
    if (!audioContext || !sfxEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function toggleBGM() {
    bgmEnabled = !bgmEnabled;
    const button = document.getElementById('bgmToggle');
    
    if (bgmEnabled) {
        button.textContent = 'BGM: ON';
        button.classList.remove('muted');
        if (audioContext) startBGM();
    } else {
        button.textContent = 'BGM: OFF';
        button.classList.add('muted');
        stopBGM();
    }
}

function toggleSFX() {
    sfxEnabled = !sfxEnabled;
    const button = document.getElementById('sfxToggle');
    
    if (sfxEnabled) {
        button.textContent = 'SFX: ON';
        button.classList.remove('muted');
    } else {
        button.textContent = 'SFX: OFF';
        button.classList.add('muted');
    }
}

// Minimax CPU implementation
function minimax(board, depth, isMaximizing) {
    const winner = checkWinner(board);
    
    if (winner === cpuSymbol) return 10 - depth; // CPU wins
    if (winner === playerSymbol) return depth - 10; // Player wins
    if (board.indexOf('') === -1) return 0; // Draw
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = cpuSymbol;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getBestMove(board) {
    if (cpuDifficulty === 'easy') {
        return getEasyMove(board);
    } else {
        // Hard mode - use minimax
        let bestScore = -Infinity;
        let bestMove = -1;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = cpuSymbol;
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }
}

function getEasyMove(board) {
    // Easy mode CPU logic: 60% chance to make optimal move, 40% chance for random move
    const random = Math.random();
    
    if (random < 0.6) {
        // Check for winning move
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = cpuSymbol;
                if (checkWinner(board) === cpuSymbol) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        
        // Check for blocking move
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = playerSymbol;
                if (checkWinner(board) === playerSymbol) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        
        // Try center if available
        if (board[4] === '') {
            return 4;
        }
        
        // Try corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
    }
    
    // Random move (or fallback)
    const availableMoves = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            availableMoves.push(i);
        }
    }
    
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    return -1; // Should never happen
}

function checkWinner(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function setGameMode(mode) {
    gameMode = mode;
    document.getElementById('vsPlayerBtn').classList.toggle('active', mode === 'player');
    document.getElementById('vsCpuBtn').classList.toggle('active', mode === 'cpu');
    
    // Show/hide symbol and difficulty selection for CPU mode
    const symbolSelection = document.getElementById('symbolSelection');
    const difficultySelection = document.getElementById('difficultySelection');
    if (mode === 'cpu') {
        symbolSelection.classList.add('show');
        difficultySelection.classList.add('show');
    } else {
        symbolSelection.classList.remove('show');
        difficultySelection.classList.remove('show');
    }
    
    // Update score labels and difficulty display
    updateScoreLabels();
    updateDifficultyDisplay();
    
    // Reset game when switching modes
    resetGame();
}

function setDifficulty(difficulty) {
    cpuDifficulty = difficulty;
    document.getElementById('hardBtn').classList.toggle('active', difficulty === 'hard');
    document.getElementById('easyBtn').classList.toggle('active', difficulty === 'easy');
    
    updateDifficultyDisplay();
    
    // Reset game when switching difficulty
    resetGame();
}

function updateDifficultyDisplay() {
    const difficultyDisplay = document.getElementById('difficultyDisplay');
    if (gameMode === 'cpu') {
        difficultyDisplay.style.display = 'block';
        difficultyDisplay.textContent = `CPU難易度: ${cpuDifficulty === 'hard' ? '最強' : '接待モード'}`;
    } else {
        difficultyDisplay.style.display = 'none';
    }
}

function setPlayerSymbol(symbol) {
    playerSymbol = symbol;
    cpuSymbol = symbol === 'O' ? 'X' : 'O';
    
    document.getElementById('symbolOBtn').classList.toggle('active', symbol === 'O');
    document.getElementById('symbolXBtn').classList.toggle('active', symbol === 'X');
    
    // Reset game when switching symbols
    resetGame();
}

function updateScoreLabels() {
    const label1 = document.getElementById('scoreLabel1');
    const label2 = document.getElementById('scoreLabel2');
    
    if (gameMode === 'cpu') {
        label1.textContent = '人間の勝利';
        label2.textContent = 'CPUの勝利';
    } else {
        label1.textContent = '◯の勝利';
        label2.textContent = '×の勝利';
    }
    updateScoreDisplay(); // スコア表示も更新
}

function updateCPUIndicator() {
    const aiIndicator = document.getElementById('aiIndicator');
    if (gameMode === 'cpu' && currentPlayer === cpuSymbol) {
        aiIndicator.style.display = 'inline-block';
    } else {
        aiIndicator.style.display = 'none';
    }
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // In CPU mode, only allow human to click
    if (gameMode === 'cpu' && currentPlayer === cpuSymbol) {
        return;
    }

    makeMove(clickedCell, clickedCellIndex);
}

function makeMove(cell, index) {
    playClickSound(); // Play sound when move is made
    updateCell(cell, index);
    const result = checkResult();
    
    if (!result && gameMode === 'cpu' && currentPlayer === cpuSymbol && gameActive) {
        // CPU's turn
        setTimeout(makeCPUMove, 500); // Add delay for thinking effect
    }
}

function makeCPUMove() {
    if (!gameActive) return;
    
    const bestMove = getBestMove([...gameBoard]);
    const cell = document.querySelector(`[data-index="${bestMove}"]`);
    
    if (cell) {
        updateCell(cell, bestMove);
        checkResult();
    }
}

function updateCell(cell, index) {
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer === 'O' ? '◯' : '×';
    cell.classList.add(currentPlayer.toLowerCase());
    cell.disabled = true;
}

function changePlayer() {
    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    document.getElementById('currentPlayer').textContent = currentPlayer === 'O' ? '◯' : '×';
    updateCPUIndicator();
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        let winnerText;
        if (gameMode === 'cpu') {
            winnerText = currentPlayer === playerSymbol ? '人間の勝利！' : 'CPUの勝利！';
        } else {
            winnerText = `${currentPlayer === 'O' ? '◯' : '×'}の勝利！`;
        }
        announceWinner(winnerText);
        playWinSound(); // Play win sound
        gameActive = false;
        updateScore(currentPlayer);
        disableAllCells();
        return true;
    }

    if (!gameBoard.includes('')) {
        announceWinner('引き分け！');
        playDrawSound(); // Play draw sound
        gameActive = false;
        if (gameMode === 'cpu') {
            cpuDraws++;
        } else {
            pvpDraws++;
        }
        updateScoreDisplay();
        return true;
    }

    changePlayer();
    return false;
}

function announceWinner(message) {
    const announcement = document.getElementById('winnerAnnouncement');
    announcement.textContent = message;
    announcement.style.display = 'block';
    
    if (message.includes('引き分け')) {
        announcement.className = 'winner-announcement draw';
    } else {
        announcement.className = 'winner-announcement winner';
    }
}

function updateScore(winner) {
    if (gameMode === 'cpu') {
        if (winner === playerSymbol) {
            cpuHumanWins++;
        } else {
            cpuWins++;
        }
    } else {
        // In 2-player mode
        if (winner === 'O') {
            pvpPlayerOWins++;
        } else {
            pvpPlayerXWins++;
        }
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    if (gameMode === 'cpu') {
        document.getElementById('score1').textContent = cpuHumanWins;
        document.getElementById('score2').textContent = cpuWins;
        document.getElementById('drawScore').textContent = cpuDraws;
    } else {
        document.getElementById('score1').textContent = pvpPlayerOWins;
        document.getElementById('score2').textContent = pvpPlayerXWins;
        document.getElementById('drawScore').textContent = pvpDraws;
    }
}

function disableAllCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.disabled = true;
    });
}

function resetGame() {
    currentPlayer = 'O'; // Always start with O
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    document.getElementById('currentPlayer').textContent = '◯';
    document.getElementById('winnerAnnouncement').style.display = 'none';
    updateCPUIndicator();
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
        cell.className = 'cell';
    });
    
    // If CPU should go first (player chose X), start CPU move
    if (gameMode === 'cpu' && playerSymbol === 'X') {
        setTimeout(makeCPUMove, 500);
    }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    // Initialize audio on first user interaction
    document.addEventListener('click', function initAudioOnClick() {
        initAudio();
        document.removeEventListener('click', initAudioOnClick);
    }, { once: true });
});