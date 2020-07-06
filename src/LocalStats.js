import StatsCard from './StatsCard';
import cards from './cards';

class LocalStats {
  constructor(statsCards = []) {
    this.statsCards = statsCards;
  }

  init() {
    if (this.statsCards.length === 0) {
      for (let i = 1; i < cards.length; i += 1) {
        const curCategory = cards[i];
        for (let j = 0; j < curCategory.length; j += 1) {
          const statsCard = new StatsCard(curCategory[j].category, curCategory[j].word, curCategory[j].translation);
          this.statsCards.push(statsCard);
        }
      }
    } else {
      for (let i = 0; i < this.statsCards.length; i += 1) {
        this.statsCards[i] = new StatsCard(this.statsCards[i].category, this.statsCards[i].word, this.statsCards[i].translation,
          this.statsCards[i].trainClicks, this.statsCards[i].correctAnswers, this.statsCards[i].mistakes, this.statsCards[i].percent);
      }
    }
  }

  addStatsClick(cardName) {
    for (let i = 0; i < this.statsCards.length; i += 1) {
      if (this.statsCards[i].word === cardName) {
        this.statsCards[i].addClick();
      }
    }
  }

  getStatsClicks(cardName) {
    let finalClick = 0;
    for (let i = 0; i < this.statsCards.length; i += 1) {
      if (this.statsCards[i].word === cardName) {
        finalClick = this.statsCards[i].getClicks();
      }
    }
    return finalClick;
  }

  addStatsAnswer(cardName) {
    for (let i = 0; i < this.statsCards.length; i += 1) {
      if (this.statsCards[i].word === cardName) {
        this.statsCards[i].addAnswer();
      }
    }
  }

  getStatsAnswers(cardName) {
    let finalAnswer = 0;
    for (let i = 0; i < this.statsCards.length; i += 1) {
      if (this.statsCards[i].word === cardName) {
        finalAnswer = this.statsCards[i].getAnswers();
      }
    }
    return finalAnswer;
  }

  addStatsMistake(cardName) {
    for (let i = 0; i < this.statsCards.length; i += 1) {
      if (this.statsCards[i].word === cardName) {
        this.statsCards[i].addMistake();
      }
    }
  }

  getStatsMistakes(cardName) {
    let finalMistake = 0;
    for (let i = 0; i < this.statsCards.length; i += 1) {
      if (this.statsCards[i].word === cardName) {
        finalMistake = this.statsCards[i].getMistakes();
      }
    }
    return finalMistake;
  }
}

export default LocalStats;
