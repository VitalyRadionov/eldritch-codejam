import ancientsData from '../data/ancients.js';
import difficulties from "../data/difficulties.js";
import greenCards from '../data/mythicCards/green/index.js';
import blueCards from '../data/mythicCards/blue/index.js';
import brownCards from '../data/mythicCards/brown/index.js';
import getRandomNum from "./randomaizer.js";

const container = document.querySelector('.container');
const ancientsContainer = container.querySelector('.ancients-container');
const toggleClassActive = (element) => element.querySelector('.active');
const difficultyContainer = document.querySelector('.difficulty-container');
const shuffleButton = document.querySelector('.shuffle-button');
const currentState = document.querySelector('.current-state');
const deck = document.querySelector('.deck');
const lastCard = document.querySelector('.last-card');

let ancientCard = [];
let cardDeckOptions = [];
let cardDeck = [];
let counterNormalCards = [];

container.addEventListener('click', defineTarget);

function defineTarget(e) {
  if (e.target.classList.contains('ancient-card') && !e.target.classList.contains('active')) {
    toggleClassActive(ancientsContainer) != null ? toggleClassActive(ancientsContainer).classList.remove('active') : [];
    e.target.classList.add('active');
    ancientCard = ancientsData.find((element) => { return e.target.classList.contains(element.id) });
    cardDeckOptions = getCards();
    console.log('cardDeckOptions', cardDeckOptions);

    toggleClassActive(difficultyContainer) != null ? toggleClassActive(difficultyContainer).classList.remove('active') : [];
    shuffleButton.style = '';
    showDifficulty();
  }

  if (e.target.classList.contains('difficulty')) {
    toggleClassActive(difficultyContainer) != null ? toggleClassActive(difficultyContainer).classList.remove('active') : [];
    e.target.classList.add('active');
    currentState.style.display = deck.style.display = lastCard.style.display = 'none';
    showShuffleButton();

    cardDeckOptions.difficulty = getDifficulty(e.target.innerText);
    console.log('cardDeckOptions', cardDeckOptions);
  }

  if (e.target.classList.contains('shuffle-button')) {
    shuffleButton.style = '';
    currentState.style.display = deck.style.display = lastCard.style.display = 'flex';
    cardDeck = shuffleCardDeck();
    console.log('cardDeck', cardDeck);
  }
}

function getCards() {
  let stage = [];

  for (const key in ancientCard) {
    if (key.includes('Stage')) {
      stage.push(ancientCard[key]);
    }
  }
  return {
    green: stage.reduce((prev, curr) => { return prev + curr.greenCards }, 0),
    blue: stage.reduce((prev, curr) => { return prev + curr.blueCards }, 0),
    brown: stage.reduce((prev, curr) => { return prev + curr.brownCards }, 0),
  }
}

function showDifficulty() {
  difficultyContainer.style.display = 'flex';
}

function showShuffleButton() {
  shuffleButton.style.display = 'flex';
}

function getDifficulty(level) {
  return difficulties.find(element => element.name == level)
}

function shuffleCardDeck() {
  return cardDeck = {
    green: greenCards.filter(element => element.difficulty != cardDeckOptions.difficulty.removeCards),
    blue: blueCards.filter(element => element.difficulty != cardDeckOptions.difficulty.removeCards),
    brown: filterCards(brownCards),
  };
}

function filterCards(colorCards) {
  colorCards = colorCards.filter(element => element.difficulty != cardDeckOptions.difficulty.removeCards);

  let difficultiesObj = [];
  ['easy', 'normal', 'hard'].filter(level => cardDeckOptions.difficulty.removeCards != level).forEach(level => difficultiesObj.push({ [level]: [...colorCards.filter(element => element.difficulty == level)] }));
  console.log('difficultiesObj', difficultiesObj);
}