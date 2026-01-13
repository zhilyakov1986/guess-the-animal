// GameState class to manage the game logic independent of UI

export class GameState {
  constructor(allAnimals) {
    this.allAnimals = allAnimals;
    this.animals = []; // Current session animals
    this.currentIndex = 0;
    this.attempts = 0;
    this.isGameOver = false;
    this.isGameWon = false;
    this.startNewGame();
  }

  startNewGame() {
    // Shuffle and pick 10
    const shuffled = [...this.allAnimals].sort(() => 0.5 - Math.random());
    this.animals = shuffled.slice(0, 10);
    this.currentIndex = 0;
    this.attempts = 0;
    this.isGameOver = false;
    this.isGameWon = false;
    this.currentOptions = []; // Store current 4 options
    this.generateOptions();
  }

  generateOptions() {
    const current = this.getCurrentAnimal();
    const others = this.allAnimals.filter(a => a.name !== current.name);
    // Shuffle others and pick 3
    const distractors = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [current, ...distractors];
    // Shuffle options
    this.currentOptions = options.sort(() => 0.5 - Math.random());
  }

  getOptions() {
    return this.currentOptions;
  }

  getCurrentAnimal() {
    return this.animals[this.currentIndex];
  }

  submitGuess(guess) {
    if (this.isGameOver || this.isGameWon) return null;

    const currentAnimal = this.getCurrentAnimal();
    // Guess is now the name directly from the button
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
      this.generateOptions();
      return true;
    }
    return false;
  }

  restart() {
    this.startNewGame();
  }
}
