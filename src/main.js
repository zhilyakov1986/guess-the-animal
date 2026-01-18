import './style.css';
import { animals } from './animals.js';
import { GameState } from './gameLogic.js';

// Initialize Game Logic
const gameState = new GameState(animals);

// DOM Elements
const cluesList = document.getElementById('clues-list');
const cluesSection = document.querySelector('.clues-section');
const header = document.querySelector('header');
// Removed input and submit btn
const choicesContainer = document.getElementById('choices-container');
const messageArea = document.getElementById('message-area');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const imageContainer = document.getElementById('image-container');

function updateClues() {
  cluesList.innerHTML = '';

  if (gameState.isGameWon || gameState.isGameOver) {
    cluesSection.classList.add('hidden');
    header.classList.add('hidden');
    return;
  }

  cluesSection.classList.remove('hidden');
  header.classList.remove('hidden');

  const clues = gameState.getCluesToShow();

  clues.forEach((clue, i) => {
    const li = document.createElement('li');
    li.className = 'clue-item';
    li.textContent = clue;
    li.style.animationDelay = `${i * 0.1}s`;
    cluesList.appendChild(li);
  });
}

function updateUI() {
  updateClues();

  // Update Choices
  choicesContainer.innerHTML = '';

  if (!gameState.isGameWon && !gameState.isGameOver) {
    const options = gameState.getOptions();
    options.forEach(animal => {
      const btn = document.createElement('button');
      btn.textContent = animal.name;
      btn.className = 'choice-btn';
      btn.onclick = () => handleGuess(animal.name, btn);
      choicesContainer.appendChild(btn);
    });
  }

  // Handle Game End States
  if (gameState.isGameWon || gameState.isGameOver) {
    showResult();
    imageContainer.classList.remove('hidden');
    // Choices logic handled above in loop
  } else {
    // Buttons active
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
  img.alt = currentAnimal.name;
  imageContainer.innerHTML = '';
  imageContainer.appendChild(img);
  // Unhidden in updateUI

  if (gameState.isGameWon) {
    messageArea.textContent = `Correct! It's a ${currentAnimal.name}!`;
    messageArea.className = 'message success';
  } else {
    messageArea.textContent = `Game Over! The correct answer was ${currentAnimal.name}.`;
    messageArea.className = 'message error';
    document.body.classList.add('game-over-body');
  }

  // Next or Restart buttons
  // Next or Restart buttons
  if (!gameState.isGameOver && gameState.currentIndex < gameState.animals.length - 1) {
    nextBtn.classList.remove('hidden');
  } else {
    restartBtn.textContent = gameState.isGameWon
      ? 'You Won the Game! Play Again?'
      : 'Play Again';
    restartBtn.classList.remove('hidden');
  }
}

function handleGuess(guess, btnElement) {
  if (gameState.isGameWon || gameState.isGameOver) return;

  const result = gameState.submitGuess(guess);

  if (result.correct) {
    // Correct guess
    btnElement.classList.add('btn-correct');
    updateUI();
  } else if (result.finished && result.gameOver) {
    // Final wrong guess
    btnElement.classList.add('btn-wrong');
    updateUI();
  } else {
    // Wrong guess, game continues
    btnElement.classList.add('btn-wrong');
    btnElement.disabled = true;

    // Animation for error
    messageArea.textContent = 'Incorrect!';
    messageArea.className = 'message error';

    // Update only clues, preserve buttons
    updateClues();

    setTimeout(() => {
      messageArea.textContent = `Wrong! Here's another clue. (${3 - gameState.attempts} tries left)`;
    }, 500);
  }
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
  document.body.classList.remove('game-over-body');
  imageContainer.innerHTML = '';
  imageContainer.classList.add('hidden');
  imageContainer.classList.add('hidden');
  nextBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
  header.classList.remove('hidden');
}

// Event Listeners
// Removed submitBtn and guessInput listeners

nextBtn.addEventListener('click', nextLevel);
restartBtn.addEventListener('click', initGame);

// Start
const landingPage = document.getElementById('landing-page');
const app = document.getElementById('app');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
  landingPage.style.opacity = '0';
  setTimeout(() => {
    landingPage.classList.add('hidden');
    app.classList.remove('hidden');
    app.style.opacity = '0';
    app.style.transition = 'opacity 0.5s ease';

    // Trigger reflow
    void app.offsetWidth;

    app.style.opacity = '1';
    initGame();
  }, 500);
});

// Remove auto initGame() call as it's now triggered by button
// initGame();
