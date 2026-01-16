import { describe, it, expect } from 'vitest';
import { GameState } from './gameLogic.js';

const mockAnimals = [
  { name: 'A1', clues: [], image: '' },
  { name: 'A2', clues: [], image: '' },
  { name: 'A3', clues: [], image: '' },
  { name: 'A4', clues: [], image: '' },
  { name: 'A5', clues: [], image: '' },
  { name: 'A6', clues: [], image: '' },
  { name: 'A7', clues: [], image: '' },
  { name: 'A8', clues: [], image: '' },
  { name: 'A9', clues: [], image: '' },
  { name: 'A10', clues: [], image: '' },
  { name: 'A11', clues: [], image: '' },
  { name: 'A12', clues: [], image: '' },
];

describe('GameState', () => {
  it('should initialize with max 10 animals from a larger list', () => {
    const game = new GameState(mockAnimals);
    expect(game.animals.length).toBe(10);
    expect(game.currentIndex).toBe(0);
  });

  it('should initialize with all animals if list is smaller than 10', () => {
    const smallList = mockAnimals.slice(0, 5);
    const game = new GameState(smallList);
    expect(game.animals.length).toBe(5);
  });

  it('should handle correct guess', () => {
    const game = new GameState(mockAnimals);
    const target = game.getCurrentAnimal();
    const result = game.submitGuess(target.name);

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

  it('should advance to next level', () => {
    const game = new GameState(mockAnimals);
    const firstAnimal = game.getCurrentAnimal();
    game.nextLevel();
    expect(game.currentIndex).toBe(1);
    expect(game.getCurrentAnimal().name).not.toBe(firstAnimal.name); // Might fail if random shuffle picks same? No, index changed.
    // Wait, random shuffle happens at start. nextLevel moves index.
    // animals[0] and animals[1] are different because input list has unique names.
  });

  it('should restart game with new random selection', () => {
    const game = new GameState(mockAnimals);
    const firstSessionAnimals = [...game.animals];

    game.restart();
    // It's possible but unlikely it picks exact same order.
    // We mainly check state reset.
    expect(game.currentIndex).toBe(0);
    expect(game.attempts).toBe(0);
    expect(game.isGameOver).toBe(false);
    expect(game.animals.length).toBe(10);
    expect(game.isGameOver).toBe(false);
    expect(game.animals.length).toBe(10);
  });

  it('should not repeat animals in next round if enough animals exist', () => {
    // Create 20 mock animals
    const manyAnimals = Array.from({ length: 20 }, (_, i) => ({
      id: `a${i}`,
      name: `Animal${i}`,
      clues: [],
      image: ''
    }));

    const game = new GameState(manyAnimals);

    // First round: 10 animals
    const round1Ids = new Set(game.animals.map(a => a.id));
    expect(round1Ids.size).toBe(10);

    // Restart game -> should get the OTHER 10 animals
    game.restart();
    const round2Ids = new Set(game.animals.map(a => a.id));
    expect(round2Ids.size).toBe(10);

    // Intersection should be 0
    let overlap = 0;
    round1Ids.forEach(id => {
      if (round2Ids.has(id)) overlap++;
    });
    expect(overlap).toBe(0);

    // Restart again -> now we have used all 20, so it should reset and allow reuse
    game.restart();
    const round3Ids = new Set(game.animals.map(a => a.id));
    expect(round3Ids.size).toBe(10);
    // Overlap is now possible/likely
  });
});
