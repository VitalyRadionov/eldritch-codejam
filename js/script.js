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
  let difficultiesObj = {};

  colorCards = colorCards.filter(element => element.difficulty != cardDeckOptions.difficulty.removeCards);

  ['easy', 'normal', 'hard']
    .filter(level => cardDeckOptions.difficulty.removeCards != level)
    .forEach(level => difficultiesObj[level] = [...colorCards.filter(element => element.difficulty == level)]);
  // console.log('difficultiesObj', difficultiesObj);

  switch (cardDeckOptions.difficulty.id) {
    case 'veryEasy':
      console.log('veryEasy');
      break;
    case 'easy':
      difficultiesObj = { easy: difficultiesObj.easy.concat(...difficultiesObj.normal) };
      console.log('difficultiesObj', difficultiesObj);
      shuffle(difficultiesObj, colorCards[0].color);
      break;
    case 'normal':
      difficultiesObj = { normal: difficultiesObj.easy.concat(...difficultiesObj.normal, ...difficultiesObj.hard) };
      shuffle(difficultiesObj, colorCards[0].color);
      break;
    case 'hard':
      difficultiesObj = { hard: difficultiesObj.hard.concat(...difficultiesObj.normal) };
      shuffle(difficultiesObj, colorCards[0].color);
      console.log('difficultiesObj', difficultiesObj);
      break;
    case 'veryHard':
      console.log('veryHard');
    default:
      break;
  }

  // shuffle(difficultiesObj, colorCards[0].color)
}

function shuffle(difficultiesObj, color) {
  let normalCards = 0;
  difficultiesObj.cardSet = [];

  normalCards = cardDeckOptions[color] - difficultiesObj[cardDeckOptions.difficulty.id].length;
  console.log(normalCards);

  for (const key in difficultiesObj) {
    if (key == cardDeckOptions.difficulty.id) {
      if (normalCards >= 0) {
        for (let index = difficultiesObj[key].length - 1; index >= 0; index--) {
          difficultiesObj.cardSet.push(...difficultiesObj[key].splice(getRandomNum(index, 0), 1));
        }
        for (let index = difficultiesObj[key].length - 1; index >= 0; index--) {
          difficultiesObj.cardSet.push(...difficultiesObj[key].splice(getRandomNum(index, 0), 1));
        }
      }
      if (normalCards < 0) {
        for (let index = cardDeckOptions[color] - 1; index >= 0; index--) {
          console.log(cardDeckOptions[color] - 1);
          difficultiesObj.cardSet.push(...difficultiesObj[key].splice(getRandomNum(difficultiesObj[key].length - 1, 0), 1));
        }
      }
    }
  }
}