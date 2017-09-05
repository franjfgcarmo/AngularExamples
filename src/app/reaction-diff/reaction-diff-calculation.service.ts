import {Injectable} from '@angular/core';

@Injectable()
export class ReactionDiffCalcServiceFactory {

  constructor() {
  }

  public createCalcService(width: number, height: number) {
    return new ReactionDiffCalcService(width, height);
  }
}

export interface Cell {
  a: number;
  b: number;
}

export interface CellWeights {
  topLeft: number;
  topCenter: number;
  topRight: number;
  left: number;
  center: number;
  right: number;
  bottomLeft: number;
  bottomCenter: number;
  bottomRight: number;
}

const defaults = {
  diffRateA: 1.0,
  diffRateB: 0.5,
  feedRate: 0.055,
  killRate: 0.062,
  weights: {
    topLeft: 0.05, topCenter: 0.2, topRight: 0.05,
    left: 0.2, center: -1.0, right: 0.2,
    bottomLeft: 0.05, bottomCenter: 0.2, bottomRight: 0.05
  }
};

export class ReactionDiffCalcService {
  public grid: Array<Array<Cell>>;
  public next: Array<Array<Cell>>;
  public diffRateA;
  public diffRateB;
  public feedRate;
  public killRate;
  public weights: CellWeights;

  constructor(private width: number, private height: number) {
    this.resetParamsAndWeights();
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
            col[y],
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
    for (let i = x - 5; i < x + 5; i++) {
      for (let j = y - 5; j < y + 5; j++) {
        const wrappedX = i < 0 ? this.width + i : i % this.width;
        const wrappedY = j < 0 ? this.height + j : j % this.height;
        this.grid[wrappedX][wrappedY] = {a: 0, b: 1};
      }
    }
  }

  calcNextCell(cell: Cell,
               deltaT: number = 1,
               dA: number,
               dB: number,
               f: number,
               k: number,
               laplaceA: number,
               laplaceB: number): Cell {

    const abb = cell.a * cell.b * cell.b;

    const nextA = cell.a +
      ((dA * laplaceA) -
        abb +
        (f * (1 - cell.a))) * deltaT;

    const nextB = cell.b +
      ((dB * laplaceB) +
        abb -
        ((k + f) * cell.b)) * deltaT;

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
    add(x, y, this.weights.center);
    add(wX(x - 1), y, this.weights.left);
    add(wX(x + 1), y, this.weights.right);
    add(x, wY(y + 1), this.weights.bottomCenter);
    add(x, wY(y - 1), this.weights.topCenter);
    add(wX(x - 1), wY(y - 1), this.weights.topLeft);
    add(wX(x - 1), wY(y + 1), this.weights.bottomLeft);
    add(wX(x + 1), wY(y - 1), this.weights.topRight);
    add(wX(x + 1), wY(y + 1), this.weights.bottomRight);
    return {sumA, sumB};
  }

  reset() {
    this.init();
  }

  constrain(val) {
    return Math.min(1.0, Math.max(0.0, val));
  }

  resetParamsAndWeights() {
    this.diffRateA = defaults.diffRateA;
    this.diffRateB = defaults.diffRateB;
    this.feedRate = defaults.feedRate;
    this.killRate = defaults.killRate;
    this.weights = Object.assign({}, defaults.weights);
  }
}
