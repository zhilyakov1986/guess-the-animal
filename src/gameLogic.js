// GameState class to manage the game logic independent of UI

export class GameState {
  constructor(allAnimals) {
    this.allAnimals = allAnimals;
    this.animals = []; // Current session animals
    this.currentIndex = 0;
    this.attempts = 0;
    this.isGameOver = false;
    this.isGameWon = false;
    this.isGameWon = false;
    this.seenIds = new Set();
    this.startNewGame();
  }

  startNewGame() {
    // Filter out seen animals
    let availableAnimals = this.animals
      ? this.allAnimals.filter(a => !this.seenIds.has(a.id))
      : this.allAnimals; // First run

    // If we don't have enough animals for a full round (10), reset seenIds
    if (availableAnimals.length < 10) {
      this.seenIds.clear();
      availableAnimals = this.allAnimals;
    }

    // Shuffle and pick 10
    const shuffled = [...availableAnimals].sort(() => 0.5 - Math.random());
    this.animals = shuffled.slice(0, 10);

    // Mark these as seen
    this.animals.forEach(a => this.seenIds.add(a.id));
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
