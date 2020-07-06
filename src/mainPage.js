import cards from './cards';
import LocalStats from './LocalStats';

const links = document.getElementsByClassName('menu-link');
const firstRow = document.getElementById('firstRow');
const firstRowSections = document.getElementById('firstRow').innerHTML;
const secondRow = document.getElementById('secondRow');
const secondRowSections = document.getElementById('secondRow').innerHTML;
const sectionTitle = document.getElementById('section-title');
const starsContainer = document.getElementById('stars-container');
const playButton = document.getElementById('play-button');
const repeatButton = document.getElementById('repeat-button');
const container = document.getElementById('container');
const header = document.getElementById('header');
const section = document.getElementById('section');
const cardTexts = document.getElementsByClassName('card-text');
const reverseContainers = document.getElementsByClassName('reverse-container');
const switchLabel = document.getElementsByTagName('label');
const input = document.getElementsByTagName('input');
const playCards = document.getElementsByClassName('card-play');
const resultContainer = document.getElementById('result-container');
const body = document.getElementById('body');
const tableContainer = document.getElementById('table-container');
const buttonsContainer = document.getElementById('buttons-container');
let title;
let categoryClick = 0;
let wordClick = 0;
let transClick = 0;
let trainclClick = 0;
let coranswClick = 0;
let mistakesClick = 0;
let percentClick = 0;
let replayCards = [];
let showReplayCards = false;

let localStats = new LocalStats((JSON.parse(localStorage.getItem('localStats'))).statsCards);
localStats.init();
localStorage.setItem('localStats', JSON.stringify(localStats));

const playAudio = (src) => {
  const audio = new Audio();
  audio.src = src;
  audio.play();
};

const getAudio = (card) => {
  playAudio(card.audioSrc);
};

const playCorrectAudio = () => {
  playAudio('audio/correct.mp3');
};

const delayedAudio = (card) => {
  setTimeout(getAudio, 1000, card);
};

const createCard = (card, color) => {
  const fragment = document.createDocumentFragment();
  const {
    word, translation, image, audioSrc,
  } = card;

  const currentCard = document.createElement('div');

  currentCard.classList.add('card', color);
  if (localStorage.getItem('playMode') === 'true') {
    currentCard.classList.add('card-play');
  }

  const currentFront = document.createElement('div');
  currentFront.classList.add('front');

  const currentBack = document.createElement('div');
  currentBack.classList.add('back', 'hidden');

  const currentImageFront = document.createElement('img');
  currentImageFront.classList.add('card-img');
  currentImageFront.src = String(image);

  const currentImageBack = document.createElement('img');
  currentImageBack.classList.add('card-img');
  currentImageBack.src = String(image);

  const reverseContainer = document.createElement('div');
  reverseContainer.classList.add('reverse-container');
  if (localStorage.getItem('playMode') === 'true') {
    reverseContainer.classList.add('hidden');
  }

  const reverseImg = document.createElement('img');
  reverseImg.classList.add('reverse-img');
  reverseImg.src = './img/assets/img/Reverse.svg';

  const currentText = document.createElement('div');
  currentText.classList.add('card-text');
  currentText.innerText = word;
  if (localStorage.getItem('playMode') === 'true') {
    currentText.classList.add('hidden');
  }

  const currentTranslation = document.createElement('div');
  currentTranslation.classList.add('card-translation');
  currentTranslation.innerText = translation;

  const currentAudio = document.createElement('audio');
  currentAudio.classList.add('audio');
  currentAudio.src = String(audioSrc);

  reverseContainer.append(reverseImg);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('col-12', 'col-sm-6', 'col-lg-3', 'content-center');

  currentFront.append(currentImageFront, reverseContainer, currentText, currentAudio);
  currentBack.append(currentImageBack, currentTranslation);
  currentCard.append(currentFront, currentBack);
  cardContainer.append(currentCard);
  fragment.append(cardContainer);
  return fragment;
};

const createReplayPage = (currentCards, color) => {
  sectionTitle.innerText = 'Difficult words';
  if (replayCards.length > 4) {
    for (let i = 0; i < 4; i += 1) {
      firstRow.append(createCard(currentCards[i], color));
    }
    for (let i = 4; i < replayCards.length; i += 1) {
      secondRow.append(createCard(currentCards[i], color));
    }
  } else {
    for (let i = 0; i < replayCards.length; i += 1) {
      firstRow.append(createCard(currentCards[i], color));
      secondRow.innerHTML = '';
    }
  }
};

const createPage = (currentCards, color, curTitle) => {
  sectionTitle.innerText = curTitle;
  for (let i = 0; i < 4; i += 1) {
    firstRow.append(createCard(currentCards[i], color));
  }
  for (let i = 4; i < 8; i += 1) {
    secondRow.append(createCard(currentCards[i], color));
  }
};

const getReplayCards = () => {
  replayCards = [];
  const tempReplayCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.percent > b.percent ? -1 : 1));
  tempReplayCards.splice(8);
  for (let i = 0; i < tempReplayCards.length; i += 1) {
    if (tempReplayCards[i].percent <= 0) {
      tempReplayCards.splice(i, 1);
      i -= 1;
    }
  }
  tempReplayCards.forEach((element) => {
    for (let i = 1; i < cards.length; i += 1) {
      for (let j = 0; j < cards[i].length; j += 1) {
        if (element.word === cards[i][j].word) {
          replayCards.push(cards[i][j]);
        }
      }
    }
  });
};

const createStatPage = () => {
  tableContainer.innerHTML = '';
  replayCards = [];
  getReplayCards();
  let statInner = `<table class="table table-striped table-sm">
  <thead>
    <tr>
      <th class="sort" scope="col">Category</th>
      <th class="sort" scope="col">Word</th>
      <th class="sort" scope="col">Translation</th>
      <th class="sort" scope="col">Train clicks</th>
      <th class="sort" scope="col">Correct answers</th>
      <th class="sort" scope="col">Mistakes</th>
      <th class="sort" scope="col">in %</th>
    </tr>
  </thead>
  <tbody>`;
  let num = 0;

  for (let j = 0; j < cards[0].length;) {
    for (let i = 1; i < cards.length; i += 1) {
      for (let k = 0; k < cards[i].length; k += 1) {
        statInner += `<tr>
        <th scope="row">${(JSON.parse(localStorage.getItem('localStats'))).statsCards[num].category}</th>
        <td>${(JSON.parse(localStorage.getItem('localStats'))).statsCards[num].word}</td>
        <td>${(JSON.parse(localStorage.getItem('localStats'))).statsCards[num].translation}</td>
        <td>${(JSON.parse(localStorage.getItem('localStats'))).statsCards[num].trainClicks}</td>
        <td>${(JSON.parse(localStorage.getItem('localStats'))).statsCards[num].correctAnswers}</td>
        <td>${(JSON.parse(localStorage.getItem('localStats'))).statsCards[num].mistakes}</td>
        <td>${(JSON.parse(localStorage.getItem('localStats'))).statsCards[num].percent}%</td>
        </tr>`;
        num += 1;
      }
      j += 1;
    }
  }

  statInner += '</tbody></table>';

  tableContainer.innerHTML = statInner;
};

const toggleSort = (text) => {
  switch (text) {
    case 'Category':
      categoryClick += 1;
      if ((categoryClick % 2) === 0) {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.category > b.category ? -1 : 1));
        localStorage.localStats = JSON.stringify(localStats);
      } else {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.category > b.category ? 1 : -1));
        localStorage.localStats = JSON.stringify(localStats);
      }
      break;
    case 'Word':
      wordClick += 1;
      if ((wordClick % 2) === 0) {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.word > b.word ? -1 : 1));
        localStorage.localStats = JSON.stringify(localStats);
      } else {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.word > b.word ? 1 : -1));
        localStorage.localStats = JSON.stringify(localStats);
      }
      break;
    case 'Translation':
      transClick += 1;
      if ((transClick % 2) === 0) {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.translation > b.translation ? -1 : 1));
        localStorage.localStats = JSON.stringify(localStats);
      } else {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.translation > b.translation ? 1 : -1));
        localStorage.localStats = JSON.stringify(localStats);
      }
      break;
    case 'Train clicks':
      trainclClick += 1;
      if ((trainclClick % 2) === 0) {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.trainClicks > b.trainClicks ? -1 : 1));
        localStorage.localStats = JSON.stringify(localStats);
      } else {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.trainClicks > b.trainClicks ? 1 : -1));
        localStorage.localStats = JSON.stringify(localStats);
      }
      break;
    case 'Correct answers':
      coranswClick += 1;
      if ((coranswClick % 2) === 0) {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.correctAnswers > b.correctAnswers ? -1 : 1));
        localStorage.localStats = JSON.stringify(localStats);
      } else {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.correctAnswers > b.correctAnswers ? 1 : -1));
        localStorage.localStats = JSON.stringify(localStats);
      }
      break;
    case 'Mistakes':
      mistakesClick += 1;
      if ((mistakesClick % 2) === 0) {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.mistakes > b.mistakes ? -1 : 1));
        localStorage.localStats = JSON.stringify(localStats);
      } else {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.mistakes > b.mistakes ? 1 : -1));
        localStorage.localStats = JSON.stringify(localStats);
      }
      break;
    case 'in %':
      percentClick += 1;
      if ((percentClick % 2) === 0) {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.percent > b.percent ? 1 : -1));
        localStorage.localStats = JSON.stringify(localStats);
      } else {
        localStats.statsCards = (JSON.parse(localStorage.getItem('localStats'))).statsCards.sort((a, b) => (a.percent > b.percent ? -1 : 1));
        localStorage.localStats = JSON.stringify(localStats);
      }
      break;
    default: break;
  }
};

const createCurrentPage = (name) => {
  firstRow.innerHTML = '';
  secondRow.innerHTML = '';
  let currentCards = [];
  let color;
  let curTitle;
  if ((localStorage.getItem('playMode') === 'true')) {
    starsContainer.classList.remove('hidden');
    playButton.classList.remove('hidden');
    repeatButton.classList.add('hidden');
  }

  switch (name) {
    case 'mainPage':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      firstRow.innerHTML = firstRowSections;
      secondRow.innerHTML = secondRowSections;
      sectionTitle.innerText = 'English For Kids';
      break;
    case 'actionA':
    case 'Action (set A)':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      currentCards = Array.from(cards[1]);
      color = 'section-card-img-actionA';
      curTitle = 'Action (set A)';
      createPage(currentCards, color, curTitle);
      break;
    case 'actionB':
    case 'Action (set B)':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      currentCards = Array.from(cards[2]);
      color = 'section-card-img-actionB';
      curTitle = 'Action (set B)';
      createPage(currentCards, color, curTitle);
      break;
    case 'animalA':
    case 'Animal (set A)':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      currentCards = Array.from(cards[3]);
      color = 'section-card-img-animalA';
      curTitle = 'Animal (set A)';
      createPage(currentCards, color, curTitle);
      break;
    case 'animalB':
    case 'Animal (set B)':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      currentCards = Array.from(cards[4]);
      color = 'section-card-img-animalB';
      curTitle = 'Animal (set B)';
      createPage(currentCards, color, curTitle);
      break;
    case 'clothes':
    case 'Clothes':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      currentCards = Array.from(cards[5]);
      color = 'section-card-img-clothes';
      curTitle = 'Clothes';
      createPage(currentCards, color, curTitle);
      break;
    case 'emotions':
    case 'Emotions':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      currentCards = Array.from(cards[6]);
      color = 'section-card-img-emotions';
      curTitle = 'Emotions';
      createPage(currentCards, color, curTitle);
      break;
    case 'fruit':
    case 'Fruit':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      currentCards = Array.from(cards[7]);
      color = 'section-card-img-fruit';
      curTitle = 'Fruit';
      createPage(currentCards, color, curTitle);
      break;
    case 'transport':
    case 'Transport':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');

      currentCards = Array.from(cards[8]);
      color = 'section-card-img-transport';
      curTitle = 'Transport';
      createPage(currentCards, color, curTitle);
      break;
    case 'statistics':
    case 'Statistics':
      sectionTitle.innerText = 'Statistics';
      tableContainer.innerHTML = '';
      createStatPage();
      container.classList.add('hidden');
      tableContainer.classList.remove('hidden');
      buttonsContainer.classList.remove('hidden');
      break;
    case 'Difficult words':
      container.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      buttonsContainer.classList.add('hidden');
      currentCards = replayCards;
      color = 'section-card-img-replay';
      createReplayPage(currentCards, color);
      break;
    default: break;
  }
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-warning-replay')) {
    showReplayCards = true;
    createCurrentPage('Difficult words');
  }
  if (event.target.classList.contains('btn-warning-reset')) {
    localStats = new LocalStats();
    localStats.init();
    localStorage.setItem('localStats', JSON.stringify(localStats));
    tableContainer.innerHTML = '';
    replayCards = [];
    createStatPage();
  }
  if (event.target.classList.contains('sort')) {
    toggleSort(event.target.innerText);
    createStatPage();
  }
  if (event.target.classList.contains('section-card-img')) {
    event.preventDefault();
    const link = event.target.offsetParent.innerText;
    links.forEach((el) => {
      el.classList.remove('active-link');
      if (el.innerText === link) {
        el.classList.add('active-link');
      }
    });
    createCurrentPage(link);
    if ((localStorage.getItem('playMode') === 'true')) {
      playButton.classList.remove('hidden');
      repeatButton.classList.add('hidden');
    }
  }
  if (event.target.classList.contains('card-img') || event.target.classList.contains('card-text')) {
    if (localStorage.getItem('playMode') === 'false') {
      const audio = event.target.offsetParent.querySelector('.audio');
      playAudio(audio.src);
      localStats.addStatsClick(event.target.offsetParent.querySelector('.card-text').innerText);
      localStorage.localStats = JSON.stringify(localStats);
    }
  }
  if (event.target.classList.contains('reverse-img')) {
    event.target.offsetParent.offsetParent.classList.add('translate');
    event.target.offsetParent.offsetParent.childNodes[1].classList.remove('hidden');
    event.target.offsetParent.offsetParent.childNodes[0].classList.add('hidden');
  }
});

links.forEach((element) => {
  element.addEventListener('click', () => {
    showReplayCards = false;
    starsContainer.innerHTML = '';
    links.forEach((el) => {
      el.classList.remove('active-link');
    });
    element.classList.add('active-link');
    createCurrentPage(element.id);
    if ((localStorage.getItem('playMode') === 'true') && (element.id !== 'mainPage')) {
      playButton.classList.remove('hidden');
      repeatButton.classList.add('hidden');
    }
    if (element.id === 'mainPage' || element.id === 'statistics') {
      starsContainer.classList.add('hidden');
      playButton.classList.add('hidden');
      repeatButton.classList.add('hidden');
    }
  });
});

document.addEventListener('mouseout', (event) => {
  if (event.target.classList.contains('card') || event.target.classList.contains('card-img')) {
    event.target.classList.remove('translate');
    if ((event.target.childNodes[0] !== undefined) && (event.target.childNodes[1] !== undefined)) {
      event.target.childNodes[0].classList.remove('hidden');
      event.target.childNodes[1].classList.add('hidden');
    }
  }
});

const addStar = () => {
  const star = document.createElement('img');
  star.src = './img/assets/img/star.svg';
  starsContainer.append(star);
};

const addWinStar = () => {
  const starWin = document.createElement('img');
  starWin.src = './img/assets/img/star-win.svg';
  starsContainer.append(starWin);
};

const returnBody = () => {
  resultContainer.innerHTML = '';
  resultContainer.classList.add('hidden');
  header.classList.remove('hidden');
  section.classList.remove('hidden');
  firstRow.innerHTML = firstRowSections;
  secondRow.innerHTML = secondRowSections;
  sectionTitle.innerText = 'English For Kids';
  localStorage.setItem('playMode', false);
  starsContainer.innerHTML = '';

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
  input[0].checked = false;
  links.forEach((el) => {
    el.classList.remove('active-link');
    if (el.innerText === 'Main Page') {
      el.classList.add('active-link');
    }
  });
};

const returnBodyDelay = () => {
  setTimeout(returnBody, 3000);
};

const finalPage = (errors) => {
  header.classList.add('hidden');
  section.classList.add('hidden');
  let errorsStr;
  let resultImg;
  if (errors === 0) {
    errorsStr = 'No errors!';
    resultImg = document.createElement('img');
    resultImg.classList.add('success-img');
    resultImg.src = './img/assets/img/success.jpg';
    playAudio('audio/success.mp3');
  } else {
    const errorsNum = String(errors);
    errorsStr = errorsNum.concat(' errors!');
    resultImg = document.createElement('img');
    resultImg.classList.add('failure-img');
    resultImg.src = './img/assets/img/failure.jpg';
    playAudio('audio/failure.mp3');
  }
  resultContainer.classList.remove('hidden');
  const resultText = document.createElement('div');
  resultText.classList.add('result-text');
  resultText.innerText = errorsStr;

  resultContainer.append(resultText, resultImg);

  returnBodyDelay();
};

let cardsForAudio = [];

const playButtonListener = () => {
  title = document.getElementById('section-title').innerText;
  cardsForAudio = [];
  if (showReplayCards) {
    for (let i = 0; i < replayCards.length; i += 1) {
      cardsForAudio.push(replayCards[i]);
    }
  } else {
    const titles = cards[0];
    for (let i = 0; i < titles.length; i += 1) {
      if (titles[i].word === title) {
        cardsForAudio = cards[i + 1];
      }
    }
  }
  playButton.classList.toggle('hidden');
  repeatButton.classList.toggle('hidden');
  cardsForAudio = cardsForAudio.sort(() => Math.random() - 0.5);
  let i = 0;
  let errors = 0;
  let currentWord = cardsForAudio[i].word;
  delayedAudio(cardsForAudio[i]);
  document.addEventListener('click', (event) => {
    if (event.target.offsetParent.classList.contains('card-play')) {
      if (event.target.nextSibling.nextSibling.innerText === currentWord) {
        if (i < cardsForAudio.length) {
          playCorrectAudio();
          addWinStar();
          event.target.offsetParent.classList.add('inactive');
          if (!showReplayCards) {
            localStats.addStatsAnswer(event.target.offsetParent.querySelector('.card-text').innerText);
            localStorage.localStats = JSON.stringify(localStats);
          }
          i += 1;
          if (i === cardsForAudio.length) {
            finalPage(errors);
          }
          if (i < cardsForAudio.length - 1) {
            delayedAudio(cardsForAudio[i]);
            currentWord = cardsForAudio[i].word;
          }
        }
      } else if ((event.target.id !== 'play-button') && (event.target.offsetParent.classList.contains('inactive') === false) && (event.target.offsetParent.classList.contains('card-play') === true)) {
        addStar();
        errors += 1;
        if (!showReplayCards) {
          localStats.addStatsMistake(cardsForAudio[i].word);
          localStorage.localStats = JSON.stringify(localStats);
        }
        playAudio('audio/error.mp3');
      }
    }
  });
  document.addEventListener('click', (event) => {
    if (event.target.id === 'repeat-button') {
      getAudio(cardsForAudio[i]);
    }
  });
};

playButton.addEventListener('click', playButtonListener);
