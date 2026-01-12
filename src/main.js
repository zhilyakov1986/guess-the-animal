import './style.css';
import { animals } from './animals.js';
import { GameState } from './gameLogic.js';

// Initialize Game Logic
const gameState = new GameState(animals);

// DOM Elements
const cluesList = document.getElementById('clues-list');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const messageArea = document.getElementById('message-area');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const imageContainer = document.getElementById('image-container');

function updateUI() {
  // Update Clues
  cluesList.innerHTML = '';
  const clues = gameState.getCluesToShow();

  clues.forEach((clue, i) => {
    const li = document.createElement('li');
    li.className = 'clue-item';
    li.textContent = clue;
    // Only animate new clues or all on initial load?
    // Implementation choice: simple animation delay for all for now.
    li.style.animationDelay = `${i * 0.1}s`;
    cluesList.appendChild(li);
  });

  // Handle Game End States
  if (gameState.isGameWon || gameState.isGameOver) {
    guessInput.disabled = true;
    showResult();
  } else {
    guessInput.disabled = false;
    guessInput.focus();
    // Buttons hidden during play
    imageContainer.classList.add('hidden');
    nextBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
  }
}

function showResult() {
  const currentAnimal = gameState.getCurrentAnimal();

  // Show image
  const img = document.createElement('img');
  img.src = currentAnimal.image;
  img.alt = currentAnimal.name; // Accessibility
  imageContainer.innerHTML = '';
  imageContainer.appendChild(img);
  imageContainer.classList.remove('hidden');

  if (gameState.isGameWon) {
    messageArea.textContent = `Correct! It's a ${currentAnimal.name}!`;
    messageArea.className = 'message success';
  } else {
    messageArea.textContent = `Game Over! The correct answer was ${currentAnimal.name}.`;
    messageArea.className = 'message error';
  }

  // Next or Restart buttons
  if (gameState.currentIndex < animals.length - 1) {
    nextBtn.classList.remove('hidden');
  } else {
    restartBtn.textContent = gameState.isGameWon
      ? 'You Won the Game! Play Again?'
      : 'Play Again';
    restartBtn.classList.remove('hidden');
  }
}

function handleGuess() {
  if (gameState.isGameWon || gameState.isGameOver) return; // Prevention

  const guess = guessInput.value;
  if (!guess.trim()) return;

  const result = gameState.submitGuess(guess);

  if (result.correct) {
    updateUI();
  } else if (result.finished && result.gameOver) {
    updateUI(); // Updates to game over state
  } else {
    // Wrong guess, game continues
    // Animation for error
    messageArea.textContent = 'Incorrect!';
    messageArea.className = 'message error';

    // Update clues
    updateUI();

    // Specific UI feedback for wrong guess that doesn't end game
    setTimeout(() => {
      messageArea.textContent = `Wrong! Here's another clue. (${3 - gameState.attempts} tries left)`;
    }, 500);
  }

  guessInput.value = '';
}

function initGame() {
  gameState.restart();
  resetUIState();
  updateUI();
}

function nextLevel() {
  if (gameState.nextLevel()) {
    resetUIState();
    updateUI();
  }
}

function resetUIState() {
  messageArea.textContent = '';
  messageArea.className = 'message';
  guessInput.value = '';
  imageContainer.innerHTML = '';
  imageContainer.classList.add('hidden');
  nextBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
}

// Event Listeners
submitBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleGuess();
});

nextBtn.addEventListener('click', nextLevel);
restartBtn.addEventListener('click', initGame);

// Start
initGame();
