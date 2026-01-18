import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { animals } from './src/animals';
import { GameState } from './src/gameLogic';

export default function App() {
  const gameStateRef = useRef(new GameState(animals));
  const gameState = gameStateRef.current;

  // UI State
  const [clues, setClues] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('neutral'); // neutral, success, error
  const [options, setOptions] = useState([]);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [showImage, setShowImage] = useState(false);
  // Track disabled buttons (wrong guesses)
  const [disabledOptions, setDisabledOptions] = useState([]);

  useEffect(() => {
    updateUI();
  }, []);

  const updateUI = () => {
    setClues(gameState.getCluesToShow());
    setOptions(gameState.getOptions());

    if (gameState.isGameWon) {
      setIsGameWon(true);
      setIsGameOver(true);
      endGame(true);
    } else if (gameState.isGameOver) {
      setIsGameOver(true);
      endGame(false);
    } else {
      // Game active
      setIsGameOver(false);
      setIsGameWon(false);
      setShowImage(false);
    }
  };

  const endGame = (won) => {
    setShowImage(true);
    setCurrentAnimal(gameState.getCurrentAnimal());
    if (won) {
      setMessage(`Correct! It's a ${gameState.getCurrentAnimal().name}!`);
      setMessageType('success');
    } else {
      setMessage(`Game Over! The correct answer was ${gameState.getCurrentAnimal().name}.`);
      setMessageType('error');
    }
  };

  const handleGuess = (selectedAnimalName) => {
    if (isGameOver || isGameWon) return;

    // Check if already disabled
    if (disabledOptions.includes(selectedAnimalName)) return;

    const result = gameState.submitGuess(selectedAnimalName);

    if (result.correct) {
      updateUI();
    } else if (result.finished && result.gameOver) {
      updateUI();
    } else {
      // Wrong guess
      setMessage(`Incorrect! (${3 - gameState.attempts} tries left)`);
      setMessageType('error');
      setClues(gameState.getCluesToShow());

      // Disable the wrong option
      setDisabledOptions(prev => [...prev, selectedAnimalName]);
    }
  };

  const handleNext = () => {
    if (gameState.nextLevel()) {
      resetUI();
    }
  };

  const handleRestart = () => {
    gameState.restart();
    resetUI();
  };

  const resetUI = () => {
    setMessage('');
    setMessageType('neutral');
    setShowImage(false);
    setCurrentAnimal(null);
    setIsGameOver(false);
    setIsGameWon(false);
    setDisabledOptions([]);
    setClues(gameState.getCluesToShow());
    setOptions(gameState.getOptions());
  };

  const getButtonStyle = (optionName) => {
    // If game ended
    if (isGameOver || isGameWon) {
      if (optionName === gameState.getCurrentAnimal()?.name) {
        return styles.buttonCorrect;
      }
      return styles.buttonDisabled;
    }
    // If active
    if (disabledOptions.includes(optionName)) {
      return styles.buttonWrong;
    }
    return styles.buttonNormal;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!isGameOver && !isGameWon && (
          <Text style={styles.title}>Wild Quest</Text>
        )}

        <View style={styles.card}>
          {showImage && currentAnimal ? (
            <Image source={currentAnimal.image} style={styles.animalImage} resizeMode="contain" />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>?</Text>
            </View>
          )}
        </View>

        {!isGameOver && !isGameWon && (
          <View style={styles.cluesContainer}>
            <Text style={styles.sectionTitle}>Clues:</Text>
            {clues.map((clue, index) => (
              <Text key={index} style={styles.clueText}>• {clue}</Text>
            ))}
          </View>
        )}

        {message ? (
          <Text style={[
            styles.message,
            messageType === 'success' && styles.successText,
            messageType === 'error' && styles.errorText
          ]}>
            {message}
          </Text>
        ) : null}

        {!isGameOver && !isGameWon && (
          <View style={styles.choicesGrid}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.name}
                style={[styles.choiceButton, getButtonStyle(option.name)]}
                onPress={() => handleGuess(option.name)}
                disabled={disabledOptions.includes(option.name)}
              >
                <Text style={styles.choiceButtonText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {(isGameOver || isGameWon) && (
          <View style={styles.controls}>
            {gameState.currentIndex < gameState.animals.length - 1 ? (
              <TouchableOpacity style={[styles.controlButton, styles.nextButton]} onPress={handleNext}>
                <Text style={styles.buttonText}>Next Animal</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.controlButton, styles.restartButton]} onPress={handleRestart}>
                <Text style={styles.buttonText}>Play Again</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    marginTop: 20,
  },
  card: {
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  animalImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
    color: '#aaa',
  },
  cluesContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  clueText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    lineHeight: 22,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  successText: {
    color: '#2ecc71',
  },
  errorText: {
    color: '#e74c3c',
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  choiceButton: {
    width: '48%',
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonNormal: {
    backgroundColor: '#fff',
  },
  buttonCorrect: {
    backgroundColor: '#2ecc71',
    borderColor: '#27ae60',
  },
  buttonWrong: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b',
    opacity: 0.6,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  choiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  controlButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  nextButton: {
    backgroundColor: '#2ecc71',
  },
  restartButton: {
    backgroundColor: '#9b59b6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
