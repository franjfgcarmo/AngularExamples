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

  calcNextCell(deltaT: number = 1, dA: number, dB: number, f: number, k: number, laplaceA: number, laplaceB: number): Cell {
    const a = this.a;
    const b = this.b;
    const abb = a * b * b;
    const nextA = a +
      ((dA * laplaceA) -
        abb +
        (f * (1 - a))) * deltaT;
    const nextB = b +
      ((dB * laplaceB) +
        abb -
        ((k + f) * b)) * deltaT;
    return new Cell(this.constrain(nextA), this.constrain(nextB));
  }


  private constrain(val) {
    return Math.min(1.0, Math.max(0.0, val));
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
        this.grid[x][y] = new Cell(1, 0);
        this.next[x][y] = new Cell(1, 0);
      }
    }

    for (let i = 100 - 5; i < 100 + 5; i++) {
      for (let j = 100 - 5; j < 10 + 5; j++) {
        this.grid[i][j] = new Cell(1, 1);
      }
    }
    this.calcNext(1);
  }

  calcNext(deltaT: number): void {
    for (let x = 1; x < this.grid.length - 1; x++) {
      const col = this.grid[x];
      for (let y = 1; y < col.length - 1; y++) {
        const nextCell =
          col[y].calcNextCell(
            deltaT,
            this.diffRateA,
            this.diffRateB,
            this.feedRate,
            this.killRate,
            this.laplaceA(x, y),
            this.laplaceB(x, y));
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
        this.grid[wrappedX][wrappedY] = new Cell(cell.a, 1);
      }
    }
  }

  laplaceA(x: number, y: number) {
    let sumA = 0.0;
    sumA += this.grid[x][y].a * -1.0; // center weight -1
    sumA += this.grid[x - 1][y].a * 0.2; // diagonal weight 0.2
    sumA += this.grid[x + 1][y].a * 0.2; // diagonal weight 0.2
    sumA += this.grid[x][y + 1].a * 0.2; // diagonal weight 0.2
    sumA += this.grid[x][y - 1].a * 0.2; // diagonal weight 0.2
    sumA += this.grid[x - 1][y - 1].a * 0.05; // center weight 0.05
    sumA += this.grid[x - 1][y + 1].a * 0.05; // center weight 0.05
    sumA += this.grid[x + 1][y - 1].a * 0.05; // center weight 0.05
    sumA += this.grid[x + 1][y + 1].a * 0.05; // center weight 0.05
    return sumA;
  }

  laplaceB(x: number, y: number) {
    let sumB = 0.0;
    sumB += this.grid[x][y].b * -1.0; // center weight -1
    sumB += this.grid[x - 1][y].b * 0.2; // diagonal weight 0.2
    sumB += this.grid[x + 1][y].b * 0.2; // diagonal weight 0.2
    sumB += this.grid[x][y + 1].b * 0.2; // diagonal weight 0.2
    sumB += this.grid[x][y - 1].b * 0.2; // diagonal weight 0.2
    sumB += this.grid[x - 1][y - 1].b * 0.05; // center weight 0.05
    sumB += this.grid[x - 1][y + 1].b * 0.05; // center weight 0.05
    sumB += this.grid[x + 1][y - 1].b * 0.05; // center weight 0.05
    sumB += this.grid[x + 1][y + 1].b * 0.05; // center weight 0.05
    return sumB;
  }

  reset() {
    this.init();
  }

}
