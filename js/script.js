import ancient from '../assets/Ancients/index.js';

const container = document.querySelector('.container');
const ancientCardActive = () => document.querySelector('.active');
const difficultyContainer = document.querySelector('.difficulty-container');

container.addEventListener('click', defineTarget);

function defineTarget(e) {
  if (e.target.classList.contains('ancient-card') && !e.target.classList.contains('active')) {
    ancientCardActive() != null ? ancientCardActive().classList.remove('active') : [];
    e.target.classList.add('active');
    showDifficulty();
  }
}

function showDifficulty() {
  difficultyContainer.style.display = 'flex';
}