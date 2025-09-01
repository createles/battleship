class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunken = false;
  }

  hit() {
    this.hits++;
  }

  isSunken() {
    if (this.hits === this.length) {
      this.sunken = true;
    }
  }
}

class Gameboard {
  constructor()
}