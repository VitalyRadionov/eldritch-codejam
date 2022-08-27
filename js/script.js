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
const stageContainer = currentState.querySelectorAll('.stage-container');

let ancientCard = [];
let cardDeckOptions = [];
let cardDeck = [];
let stages = [];
let currStage = 0;
let lapCounter = [0, 0, 0];

container.addEventListener('click', defineTarget);

function defineTarget(e) {
  if (e.target.classList.contains('ancient-card') && !e.target.classList.contains('active')) {
    toggleClassActive(ancientsContainer) != null ? toggleClassActive(ancientsContainer).classList.remove('active') : [];
    e.target.classList.add('active');
    ancientCard = ancientsData.find((element) => { return e.target.classList.contains(element.id) });
    cardDeckOptions = getCards();

    toggleClassActive(difficultyContainer) != null ? toggleClassActive(difficultyContainer).classList.remove('active') : [];
    shuffleButton.style = '';
    showDifficulty();
    currentState.style.display = deck.style.display = lastCard.style.display = 'none';
    lastCard.style.backgroundImage = ``;
    stages = [];
    currStage = 0;
    lapCounter = [0, 0, 0];
  }

  if (e.target.classList.contains('difficulty')) {
    toggleClassActive(difficultyContainer) != null ? toggleClassActive(difficultyContainer).classList.remove('active') : [];
    e.target.classList.add('active');
    currentState.style.display = deck.style.display = lastCard.style.display = 'none';
    showShuffleButton();

    cardDeckOptions.difficulty = getDifficulty(e.target.innerText);
    stages = [];
    currStage = 0;
    lapCounter = [0, 0, 0];
  }

  if (e.target.classList.contains('shuffle-button')) {
    shuffleButton.style = '';
    currentState.style.display = deck.style.display = lastCard.style.display = 'flex';
    deck.style.backgroundImage = `url('./assets/mythicCardBackground.png')`;
    lastCard.style.backgroundImage = ``;
    cardDeck = shuffleCardDeck();
    showStageTracker(cardDeck);
    console.log('cardDeck', cardDeck);
  }

  if (e.target.classList.contains('deck')) {
    changeTracker();
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
    greenCards: filterCards(greenCards),
    blueCards: filterCards(blueCards),
    brownCards: filterCards(brownCards),
  };
}

function filterCards(colorCards) {
  let difficultiesObj = {};

  colorCards = colorCards.filter(element => element.difficulty != cardDeckOptions.difficulty.removeCards);

  ['easy', 'normal', 'hard']
    .filter(level => cardDeckOptions.difficulty.removeCards != level)
    .forEach(level => difficultiesObj[level] = [...colorCards.filter(element => element.difficulty && level.includes(element.difficulty))]);


  switch (cardDeckOptions.difficulty.id) {
    case 'veryEasy':
      return shuffle(difficultiesObj, colorCards[0].color, 'easy');
    case 'easy':
      difficultiesObj = { easy: difficultiesObj.easy.concat(...difficultiesObj.normal) };
      return shuffle(difficultiesObj, colorCards[0].color, 'easy');
    case 'normal':
      difficultiesObj = { normal: difficultiesObj.easy.concat(...difficultiesObj.normal, ...difficultiesObj.hard) };
      return shuffle(difficultiesObj, colorCards[0].color, 'normal');
    case 'hard':
      difficultiesObj = { hard: difficultiesObj.hard.concat(...difficultiesObj.normal) };
      return shuffle(difficultiesObj, colorCards[0].color, 'hard');
    case 'veryHard':
      return shuffle(difficultiesObj, colorCards[0].color, 'hard');
    default:
      break;
  }
}

function shuffle(difficultiesObj, color, level) {
  let normalCards = 0;
  let cardSet = [];

  normalCards = cardDeckOptions[color] - difficultiesObj[level].length;

  if (normalCards >= 0) {
    for (let index = normalCards; index > 0; index--) {
      cardSet.push(...difficultiesObj.normal.splice(getRandomNum(difficultiesObj.normal.length - 1, 0), 1));
    }
    difficultiesObj = { [level]: cardSet.concat(...difficultiesObj[level]) };
    cardSet = [];
    for (let index = difficultiesObj[level].length - 1; index >= 0; index--) {
      cardSet.push(...difficultiesObj[level].splice(getRandomNum(index, 0), 1));
    }
  } else {
    for (let index = cardDeckOptions[color] - 1; index >= 0; index--) {
      cardSet.push(...difficultiesObj[level].splice(getRandomNum(difficultiesObj[level].length - 1, 0), 1));
    }
  }
  return difficultiesObj = cardSet;
}

function showStageTracker() {
  // let stage = [];
  let a = 0
  for (const key in ancientCard) {
    if (key.includes('Stage')) {
      stages.push(ancientCard[key]);
      for (const i in ancientCard[key]) {
        lapCounter[a] = lapCounter[a] + ancientCard[key][i];
      }
      a++;
    }
  }

  currentState.querySelectorAll('.stage-text').forEach(element => {
    element.classList.remove('done');
  });

  stages.forEach((element, index) => {
    stageContainer[index].querySelector('.dots-container').innerHTML = `
    <div class="dot green">${element.greenCards}</div>
    <div class="dot brown">${element.brownCards}</div>
    <div class="dot blue">${element.blueCards}</div>`
  });

  cardDeck = getSingleDeck(stages)
}

function getSingleDeck(stages) {
  let cardSet = [];
  let st = [];
  stages.forEach((element, item) => {
    for (const key in element) {
      for (let index = 0; index < element[key]; index++) {
        st.push(...cardDeck[key].splice(0, 1));
      }
    }
    for (let index = st.length - 1; index >= 0; index--) {
      cardSet.push(...st.splice(getRandomNum(index, 0), 1));
    }
  });
  return cardSet;
}


function changeTracker() {
  if (currStage < lapCounter.length) {
    showLastCard();
    let remCard = [...cardDeck.splice(0, 1)];
    let counter = stageContainer[currStage].querySelector('.' + remCard[0].color);

    lapCounter[currStage]--;
    counter.innerText = `${+counter.innerText - 1}`
    if (!lapCounter[currStage]) {
      stageContainer[currStage].querySelector('.stage-text').classList.add('done');
      currStage++;
    }
    console.log(...remCard);
  }
}

function showLastCard() {
  lastCard.style.backgroundImage = `url(${cardDeck[0].cardFace})`;
}