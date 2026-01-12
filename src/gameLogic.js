// GameState class to manage the game logic independent of UI

export class GameState {
  constructor(animals) {
    this.animals = animals;
    this.currentIndex = 0;
    this.attempts = 0;
    this.isGameOver = false;
    this.isGameWon = false;
  }

  getCurrentAnimal() {
    return this.animals[this.currentIndex];
  }

  submitGuess(guess) {
    if (this.isGameOver || this.isGameWon) return null;

    const currentAnimal = this.getCurrentAnimal();
    const normalizedGuess = guess.trim().toLowerCase();

    if (normalizedGuess === currentAnimal.name.toLowerCase()) {
      this.isGameWon = true;
      return { correct: true, finished: true };
    } else {
      this.attempts++;
      if (this.attempts >= 3) {
        this.isGameOver = true;
        return { correct: false, finished: true, gameOver: true };
      }
      return { correct: false, finished: false, attempts: this.attempts };
    }
  }

  getCluesToShow() {
    // Base 3 clues + 1 per wrong attempt
    // But max clues is the length of clues array
    const baseClues = 3;
    const count = baseClues + this.attempts;
    const currentAnimal = this.getCurrentAnimal();
    return currentAnimal.clues.slice(0, count);
  }

  nextLevel() {
    if (this.currentIndex < this.animals.length - 1) {
      this.currentIndex++;
      this.attempts = 0;
      this.isGameOver = false;
      this.isGameWon = false;
      return true;
    }
    return false;
  }

  restart() {
    this.currentIndex = 0;
    this.attempts = 0;
    this.isGameOver = false;
    this.isGameWon = false;
  }
}
