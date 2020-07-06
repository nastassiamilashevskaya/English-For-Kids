// import cards from './cards';

class StatsCard {
  constructor(category, word, translation, trainClicks = 0, correctAnswers = 0, mistakes = 0, percent = 0) {
    this.category = category;
    this.word = word;
    this.translation = translation;
    this.trainClicks = trainClicks;
    this.correctAnswers = correctAnswers;
    this.mistakes = mistakes;
    this.percent = percent;
    if (this.percent === null) {
      this.percent = 0;
    }
  }

  addClick() {
    this.trainClicks += 1;
  }

  getClicks() {
    return this.trainClicks;
  }

  addAnswer() {
    this.correctAnswers += 1;
    this.percent = Math.floor((this.mistakes / (this.correctAnswers + this.mistakes)) * 100);
    if (this.percent === null) {
      this.percent = 0;
    }
  }

  getAnswers() {
    return this.correctAnswers;
  }

  addMistake() {
    this.mistakes += 1;
    this.percent = Math.floor((this.mistakes / (this.correctAnswers + this.mistakes)) * 100);
    if (this.percent === null) {
      this.percent = 0;
    }
  }

  getMistakes() {
    return this.mistakes;
  }
}

export default StatsCard;
