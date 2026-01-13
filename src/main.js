import './style.css';
import { animals } from './animals.js';
import { GameState } from './gameLogic.js';

// Initialize Game Logic
const gameState = new GameState(animals);

// DOM Elements
const cluesList = document.getElementById('clues-list');
// Removed input and submit btn
const choicesContainer = document.getElementById('choices-container');
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
    li.style.animationDelay = `${i * 0.1}s`;
    cluesList.appendChild(li);
  });

  // Update Choices
  choicesContainer.innerHTML = '';
  const options = gameState.getOptions();

  // If game isn't over, show active buttons
  // If game IS over, show state (who was correct, etc.)

  options.forEach(animal => {
    const btn = document.createElement('button');
    btn.textContent = animal.name;
    btn.className = 'choice-btn';

    if (gameState.isGameWon || gameState.isGameOver) {
      btn.disabled = true;
      // Highlight logic
      if (animal.name === gameState.getCurrentAnimal().name) {
        btn.classList.add('btn-correct');
      } else {
        // If this was the last wrong guess, maybe highlight it? 
        // Simpler: Just highlight the correct one.
      }
    } else {
      btn.onclick = () => handleGuess(animal.name, btn);
    }
    choicesContainer.appendChild(btn);
  });

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
  }

  // Next or Restart buttons
  if (gameState.currentIndex < gameState.animals.length - 1) {
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
    btnElement.disabled = true; // Disable just this wrong option

    // Animation for error
    messageArea.textContent = 'Incorrect!';
    messageArea.className = 'message error';

    // Update clues (since attempts increased)
    // We only update clues list to avoid re-rendering all buttons and losing the 'btn-wrong' class/disabled state
    // Actually, calling updateUI re-renders everything. 
    // To preserve "disabled" state of specific wrong buttons, we rely on the fact 
    // that we want to show new clues. 
    // Optimization: updateUI re-renders buttons. 
    // We should probably just update clues part or track disabled options in gameState?
    // For simplicity: Re-render is fine, but we lose which specific buttons were clicked wrong unless we track it.
    // Allow re-guessing different buttons. 
    // Wait, if I re-render, the red button resets? YES.
    // Solution: Let's simpler approach -> updateUI renders fresh.
    // User just clicks another button.
    // Ideally, previously clicked wrong buttons should stay disabled.
    // BUT gameState only tracks "attempts", not "which wrong guesses".

    // Quick fix: Just update clues directly here without full re-render?
    // Or full re-render is okay, user just has to remember? No that's bad UX.
    // Let's rely on standard UI update:
    // GameState doesn't track *which* wrong options. 
    // I won't change GameState structure now. 
    // I will simply Flash the message and update clues. 
    // Re-rendering resets buttons to "neutral". That's acceptable for a simple game, 
    // OR I can make buttons disabled visually but not persist across re-render.
    // actually, let's keep it simple.

    updateUI();

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
  imageContainer.innerHTML = '';
  imageContainer.classList.add('hidden');
  nextBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
}

// Event Listeners
// Removed submitBtn and guessInput listeners

nextBtn.addEventListener('click', nextLevel);
restartBtn.addEventListener('click', initGame);

// Start
initGame();
