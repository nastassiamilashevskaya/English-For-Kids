import './style.scss';
import './cards';
import './mainPage';
import './LocalStats';
import './StatsCard';

const MENU_BUTTON = document.getElementById('menu-img');
const MENU = document.getElementById('menu');
const switchLabel = document.getElementsByTagName('label');
const playCards = document.getElementsByClassName('card');
const cardTexts = document.getElementsByClassName('card-text');
const reverseContainers = document.getElementsByClassName('reverse-container');
const playButton = document.getElementById('play-button');
const repeatButton = document.getElementById('repeat-button');
const starsContainer = document.getElementById('stars-container');
const body = document.getElementById('body');
const sectionTitle = document.getElementById('section-title');

localStorage.setItem('playMode', false);

document.addEventListener('click', (event) => {
  if ((event.target.id !== 'menu' && !MENU.classList.contains('menu-hidden')) || event.target.id === 'menu-img') {
    MENU.classList.toggle('menu-hidden');
    MENU_BUTTON.classList.toggle('menu-img-active');
  }
});

switchLabel[0].addEventListener('click', () => {
  if (switchLabel[0].classList.contains('train')) {
    localStorage.setItem('playMode', true);

    body.classList.remove('body-train');
    body.classList.add('body-play');

    switchLabel[0].innerText = 'Play';
    switchLabel[0].classList.add('play');
    switchLabel[0].classList.remove('train');

    if ((sectionTitle.innerText !== 'English For Kids') && (sectionTitle.innerText !== 'Statistics')) {
      cardTexts.forEach((element) => {
        element.classList.add('hidden');
      });
      reverseContainers.forEach((element) => {
        element.classList.add('hidden');
      });
      playCards.forEach((element) => {
        element.classList.add('card-play');
      });
      playButton.classList.remove('hidden');
      starsContainer.classList.remove('hidden');
    }
  } else if (switchLabel[0].classList.contains('play')) {
    localStorage.setItem('playMode', false);

    body.classList.remove('body-play');
    body.classList.add('body-train');

    switchLabel[0].innerText = 'Train';
    switchLabel[0].classList.add('train');
    switchLabel[0].classList.remove('play');

    cardTexts.forEach((element) => {
      element.classList.remove('hidden');
    });
    reverseContainers.forEach((element) => {
      element.classList.remove('hidden');
    });
    playCards.forEach((element) => {
      element.classList.remove('card-play');
    });
    playButton.classList.add('hidden');
    repeatButton.classList.add('hidden');
    starsContainer.classList.add('hidden');
  }
});
