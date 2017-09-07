import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {Cell} from './cell';
import {CalcCellWeights} from './cell-weights';
import 'rxjs/add/operator/share';
import {ReactionDiffConfigService} from './reaction-diff-config.service';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class ReactionDiffCalcServiceFactory {
  lastCalcService: ReactionDiffCalcService;

  constructor(private configService: ReactionDiffConfigService) {
  }

  public createCalcService(width: number, height: number) {
    this.lastCalcService = new ReactionDiffCalcService(
      width,
      height,
      this.configService.calcParams$,
      this.configService.calcCellWeights$,
      this.configService.addChemicalRadius$
    );
    return this.lastCalcService;
  }
}

const constrain = (val: number) => Math.min(1.0, Math.max(0.0, val));

export class ReactionDiffCalcService {
  public grid: Array<Array<Cell>>;
  public next: Array<Array<Cell>>;
  private diffRateA;
  private diffRateB;
  private feedRate;
  private killRate;
  private weights: CalcCellWeights;
  private addChemicalRadius: number;

  constructor(private width: number,
              private height: number,
              calcParams$: Observable<ReactionDiffCalcParams>,
              weightParams$: Observable<CalcCellWeights>,
              addChemicalRadius$: Observable<number>) {
    calcParams$.subscribe((calcParams) => this.setCalcParams(calcParams));
    weightParams$.subscribe((weights) => this.setWeights(weights));
    addChemicalRadius$.subscribe((radius) => this.addChemicalRadius = radius);
    this.init();
  }

  private setWeights(weights: CalcCellWeights) {
    this.weights = Object.assign({}, weights);
  }

  private setCalcParams(calcParams: ReactionDiffCalcParams) {
    this.diffRateA = calcParams.diffRateA;
    this.diffRateB = calcParams.diffRateB;
    this.feedRate = calcParams.feedRate;
    this.killRate = calcParams.killRate;
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
  }

  public resize(newWidth: number, newHeight: number) {
    console.log('old length:', this.grid.length, 'new length:', newWidth);

    const createNewRow = () => [];
    this.grid = this.adjustArrayLength(newWidth, this.grid, createNewRow);
    this.next = this.adjustArrayLength(newWidth, this.next, createNewRow);
    const createNewCell = () => {
      return {a: 1, b: 0};
    };
    this.grid = this.grid.map((column) => this.adjustArrayLength(newHeight, column, createNewCell));
    this.next = this.next.map((column) => this.adjustArrayLength(newHeight, column, createNewCell));
    console.log('new grid length:', this.grid.length, 'should be:', newWidth);
    this.width = newWidth;
    this.height = newHeight;
  }

  private adjustArrayLength<T>(width: number, array: Array<T>, elementConstructor: () => T): Array<T> {
    const difference = array.length - width;
    const upperDiff = Math.round(Math.abs(difference) / 2);
    const lowerDiff = Math.floor(Math.abs(difference) / 2);
    if (difference > 0) {
      array.splice(0, lowerDiff);
      array.splice(array.length - upperDiff, upperDiff);
    }
    if (difference < 0) {
      const preElemsToAdd: T[] = [];
      for (let i = 0; i < lowerDiff; i++) {
        preElemsToAdd.push(elementConstructor());
      }
      const postElemsToAdd: T[] = [];
      for (let i = 0; i < upperDiff; i++) {
        postElemsToAdd.push(elementConstructor());
      }
      array = [...preElemsToAdd, ...array, ...postElemsToAdd];
    }

    return array;
  }

  public calcNext(): void {
    for (let x = 0; x < this.grid.length; x++) {
      const col = this.grid[x];
      for (let y = 0; y < col.length; y++) {
        const laplace = this.laplace(x, y);
        this.next[x][y] = this.calcNextCell(
          col[y],
          this.diffRateA,
          this.diffRateB,
          this.feedRate,
          this.killRate,
          laplace.sumA,
          laplace.sumB);
      }
    }
    const tmp = this.grid;
    this.grid = this.next;
    this.next = tmp;
  }

  private calcNextCell(cell: Cell,
                       dA: number,
                       dB: number,
                       f: number,
                       k: number,
                       laplaceA: number,
                       laplaceB: number): Cell {

    const abb = cell.a * cell.b * cell.b;

    const nextA = cell.a +
      (dA * laplaceA) -
      abb +
      (f * (1 - cell.a));

    const nextB = cell.b +
      (dB * laplaceB) +
      abb -
      ((k + f) * cell.b);

    return {a: constrain(nextA), b: constrain(nextB)};
  }

  addChemical(x, y) {
    const halfD = this.addChemicalRadius;
    for (let i = -halfD; i < halfD; i++) {
      for (let j = -halfD; j < halfD; j++) {
        const wrappedX = x + i < 0 ? this.width + i : (x + i) % this.width;
        const wrappedY = y + j < 0 ? this.height + j : (y + j) % this.height;
        const bToAdd = halfD / (i * i + j * j);
        const cell = this.grid[wrappedX][wrappedY];
        this.grid[wrappedX][wrappedY] = {
          a: cell.a,
          b: constrain(cell.b + bToAdd)
        };
      }
    }
  }

  private laplace(x: number, y: number) {
    let sumA = 0.0;
    let sumB = 0.0;

    const wX = (i) => i < 0 ? this.width + i : i % this.width;
    const wY = (j) => j < 0 ? this.height + j : j % this.height;
    const add = (i, j, weight) => {
      const cell = this.grid[i][j];
      sumA += cell.a * weight;
      sumB += cell.b * weight;
    };
    const w = this.weights;
    add(x, y, w.center);
    add(wX(x - 1), y, w.left);
    add(wX(x + 1), y, w.right);
    add(x, wY(y + 1), w.bottomCenter);
    add(x, wY(y - 1), w.topCenter);
    add(wX(x - 1), wY(y - 1), w.topLeft);
    add(wX(x - 1), wY(y + 1), w.bottomLeft);
    add(wX(x + 1), wY(y - 1), w.topRight);
    add(wX(x + 1), wY(y + 1), w.bottomRight);
    return {sumA, sumB};
  }

  public reset() {
    this.init();
  }

}
