import { describe, it, expect } from 'vitest';
import { GameState } from './gameLogic.js';

const mockAnimals = [
  {
    name: 'TestAnimal',
    clues: ['Clue 1', 'Clue 2', 'Clue 3', 'Clue 4', 'Clue 5'],
    image: 'test.png',
  },
  {
    name: 'SecondAnimal',
    clues: ['Clue A', 'Clue B', 'Clue C'],
    image: 'second.png',
  },
];

describe('GameState', () => {
  it('should initialize correctly', () => {
    const game = new GameState(mockAnimals);
    expect(game.currentIndex).toBe(0);
    expect(game.attempts).toBe(0);
    expect(game.isGameOver).toBe(false);
    expect(game.getCurrentAnimal().name).toBe('TestAnimal');
  });

  it('should handle correct guess', () => {
    const game = new GameState(mockAnimals);
    const result = game.submitGuess('TestAnimal');

    expect(result.correct).toBe(true);
    expect(game.isGameWon).toBe(true);
  });

  it('should handle case-insensitive guess', () => {
    const game = new GameState(mockAnimals);
    const result = game.submitGuess('testanimal');

    expect(result.correct).toBe(true);
    expect(game.isGameWon).toBe(true);
  });

  it('should handle wrong guess and increment attempts', () => {
    const game = new GameState(mockAnimals);
    const result = game.submitGuess('Wrong');

    expect(result.correct).toBe(false);
    expect(game.attempts).toBe(1);
    expect(game.isGameOver).toBe(false);
  });

  it('should trigger game over after 3 wrong guesses', () => {
    const game = new GameState(mockAnimals);
    game.submitGuess('Wrong1');
    game.submitGuess('Wrong2');
    const result = game.submitGuess('Wrong3');

    expect(result.gameOver).toBe(true);
    expect(game.isGameOver).toBe(true);
  });

  it('should provide correct number of clues based on attempts', () => {
    const game = new GameState(mockAnimals);
    // Initial: 3 clues
    expect(game.getCluesToShow().length).toBe(3);

    game.submitGuess('Wrong1'); // attempts = 1
    // Should show 3 + 1 = 4 clues
    expect(game.getCluesToShow().length).toBe(4);

    game.submitGuess('Wrong2'); // attempts = 2
    // Should show 3 + 2 = 5 clues
    expect(game.getCluesToShow().length).toBe(5);
  });

  it('should advance to next level', () => {
    const game = new GameState(mockAnimals);
    game.nextLevel();
    expect(game.currentIndex).toBe(1);
    expect(game.getCurrentAnimal().name).toBe('SecondAnimal');
    expect(game.attempts).toBe(0);
  });

  it('should restart game', () => {
    const game = new GameState(mockAnimals);
    game.nextLevel();
    game.submitGuess('Wrong');
    game.restart();

    expect(game.currentIndex).toBe(0);
    expect(game.attempts).toBe(0);
    expect(game.isGameOver).toBe(false);
  });
});
