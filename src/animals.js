import lionImg from './assets/lion.png';
import elephantImg from './assets/elephant.png';
import penguinImg from './assets/penguin.png';

export const animals = [
  {
    id: 'lion',
    name: 'Lion',
    clues: [
      "I am known as the 'King of the Jungle'.",
      "I have a magnificent mane (if I'm male).",
      'I live in prides in the African savanna.',
      'My roar can be heard from 5 miles away.',
      'I spend up to 20 hours a day sleeping.',
    ],
    image: lionImg,
  },
  {
    id: 'elephant',
    name: 'Elephant',
    clues: [
      'I am the largest land animal on Earth.',
      'I have a long trunk that I use like a hand.',
      'I have large ears that look like the African continent.',
      'I am known for my incredible memory.',
      'I have tusks made of ivory.',
    ],
    image: elephantImg,
  },
  {
    id: 'penguin',
    name: 'Penguin',
    clues: [
      'I am a bird, but I cannot fly.',
      'I live primarily in the Southern Hemisphere, mostly Antarctica.',
      'I am an excellent swimmer and spend half my life in water.',
      'I wear a tuxedo-like black and white plumage.',
      'Emperor species of my kind march to breeding grounds.',
    ],
    image: penguinImg,
  },
];
