import {Injectable} from '@angular/core';

@Injectable()
export class CalcServiceFactory {

  constructor() {
  }

  public createCalcService(width: number, height: number) {
    return new CalcService(width, height);
  }
}

export class Cell {


  constructor(public a: number, public b: number) {
  }


}

export class CalcService {
  public grid: Array<Array<Cell>>;
  public next: Array<Array<Cell>>;
  public diffRateA = 1.0;
  public diffRateB = 0.5;
  public feedRate = 0.055;
  public killRate = 0.062;

  constructor(private width: number, private height: number) {
    this.init();
  }

  private init() {
    this.grid = [];
    this.next = [];

    for (let x = 0; x < this.width; x++) {
      this.grid[x] = [];
      this.next[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.grid[x][y] = {a: 1, b: 0};
        this.next[x][y] = {a: 1, b: 0};
      }
    }

    this.addChemical(Math.floor(this.width / 2), Math.floor(this.height / 2));
    this.calcNext(1);
  }

  calcNext(deltaT: number): void {
    for (let x = 0; x < this.grid.length; x++) {
      const col = this.grid[x];
      for (let y = 0; y < col.length; y++) {
        const laplace = this.laplace(x, y);
        const nextCell =
          this.calcNextCell(
            col[y].a,
            col[y].b,
            deltaT,
            this.diffRateA,
            this.diffRateB,
            this.feedRate,
            this.killRate,
            laplace.sumA,
            laplace.sumB);
        this.next[x][y] = nextCell;
      }
    }
    const tmp = this.grid;
    this.grid = this.next;
    this.next = tmp;
  }

  addChemical(x, y) {
    console.log('addChemicals: ', x, y);
    for (let i = x - 5; i < x + 5; i++) {
      for (let j = y - 5; j < y + 5; j++) {
        const wrappedX = i < 0 ? this.width + i : i % this.width;
        const wrappedY = j < 0 ? this.height + j : j % this.height;
        const cell = this.grid[wrappedX][wrappedY];
        this.grid[wrappedX][wrappedY] = {a: 0, b: 1};
      }
    }
  }

  calcNextCell(a: number,
               b: number,
               deltaT: number = 1,
               dA: number,
               dB: number,
               f: number,
               k: number,
               laplaceA: number,
               laplaceB: number): { a: number, b: number } {
    const abb = a * b * b;
    const nextA = a +
      ((dA * laplaceA) -
        abb +
        (f * (1 - a))) * deltaT;
    const nextB = b +
      ((dB * laplaceB) +
        abb -
        ((k + f) * b)) * deltaT;
    return {a: this.constrain(nextA), b: this.constrain(nextB)};
  }

  laplace(x: number, y: number) {
    let sumA = 0.0;
    let sumB = 0.0;

    const wX = (i) => i < 0 ? this.width + i : i % this.width;
    const wY = (j) => j < 0 ? this.height + j : j % this.height;
    const add = (i, j, weight) => {
      const cell = this.grid[i][j];
      sumA += cell.a * weight;
      sumB += cell.b * weight;
    };
    add(x, y, -1.0); // center weight -1
    add(wX(x - 1), y, 0.2); // diagonal weight 0.2
    add(wX(x + 1), y, 0.2); // diagonal weight 0.2
    add(x, wY(y + 1), 0.2); // diagonal weight 0.2
    add(x, wY(y - 1), 0.2); // diagonal weight 0.2
    add(wX(x - 1), wY(y - 1), 0.05); // center weight 0.05
    add(wX(x - 1), wY(y + 1), 0.05); // center weight 0.05
    add(wX(x + 1), wY(y - 1), 0.05); // center weight 0.05
    add(wX(x + 1), wY(y + 1), 0.05); // center weight 0.05
    return {sumA, sumB};


  }

  laplaceB(x: number, y: number) {
    let sum = 0;

    const wX = (i) => i < 0 ? this.width + i : i % this.width;
    const wY = (j) => j < 0 ? this.height + j : j % this.height;

    sum += this.grid[x][y].b * -1.0; // center weight -1
    sum += this.grid[wX(x - 1)][y].b * 0.2; // diagonal weight 0.2
    sum += this.grid[wX(x + 1)][y].b * 0.2; // diagonal weight 0.2
    sum += this.grid[x][wY(y + 1)].b * 0.2; // diagonal weight 0.2
    sum += this.grid[x][wY(y - 1)].b * 0.2; // diagonal weight 0.2
    sum += this.grid[wX(x - 1)][wY(y - 1)].b * 0.05; // center weight 0.05
    sum += this.grid[wX(x - 1)][wY(y + 1)].b * 0.05; // center weight 0.05
    sum += this.grid[wX(x + 1)][wY(y - 1)].b * 0.05; // center weight 0.05
    sum += this.grid[wX(x + 1)][wY(y + 1)].b * 0.05; // center weight 0.05
    return sum;
  }

  reset() {
    this.init();
  }

  constrain(val) {
    return Math.min(1.0, Math.max(0.0, val));
  }


}
