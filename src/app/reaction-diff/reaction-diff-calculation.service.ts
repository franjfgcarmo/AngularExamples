import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {Cell} from './cell';
import {CalcCellWeights} from './cell-weights';
import 'rxjs/add/operator/share';
import {ReactionDiffConfigService} from './reaction-diff-config.service';
import {WebWorkerService} from 'angular2-web-worker';

@Injectable()
export class ReactionDiffCalcServiceFactory {
  lastCalcService: ReactionDiffCalcService;

  constructor(private configService: ReactionDiffConfigService,
              private webWorkerService: WebWorkerService) {
  }

  public createCalcService(width: number, height: number) {
    this.lastCalcService = new ReactionDiffCalcService(
      width,
      height,
      this.configService.calcParams$,
      this.configService.calcCellWeights$,
      this.configService.addChemicalRadius$,
      this.webWorkerService
    );
    return this.lastCalcService;
  }
}

interface CalcNextWebWorkerParam {
  width: number;
  height: number;
  gridBuffer: ArrayBuffer;
  dA: number;
  dB: number;
  f: number;
  k: number;
  w: CalcCellWeights;
  offsetRow: number;
  offsetLength: number;
}

export class ReactionDiffCalcService {


  // private gridBuffer: ArrayBuffer;
  public grid: Float64Array;
  public numberThreads = 4;
  private calcRunning: boolean;
  private diffRateA;
  private diffRateB;
  private feedRate;
  private killRate;
  private weights: CalcCellWeights;
  private addChemicalRadius: number;
  private isResizing = false;
  private isAddingChemical = false;

  constructor(private width: number,
              private height: number,
              calcParams$: Observable<ReactionDiffCalcParams>,
              weightParams$: Observable<CalcCellWeights>,
              addChemicalRadius$: Observable<number>,
              private webWorkerService: WebWorkerService) {
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
    // this.gridBuffer = new ArrayBuffer(this.width * this.height * 2);
    this.grid = new Float64Array(this.width * this.height * 2);

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.setCell(x, y, {a: 1, b: 0});
      }
    }

    this.addChemical(Math.floor(this.width / 2), Math.floor(this.height / 2));
  }

  private setCell(column: number, row: number, cell: Cell, width: number = this.width, arrayToSet: Float64Array = this.grid) {
    const index = (column + row * width) * 2;
    arrayToSet[index] = cell.a;
    arrayToSet[index + 1] = cell.b;
  }

  private getCell(column: number, row: number, width: number = this.width, arrayToGet: Float64Array = this.grid): Cell {
    const index = (column + row * width) * 2;
    return {
      a: arrayToGet[index], b: arrayToGet[index + 1]
    };
  }

  public resize(newWidth: number, newHeight: number) {
    this.isResizing = true;
    this.grid = this.adjustGridLength(newWidth, newHeight);
    this.width = newWidth;
    this.height = newHeight;
    this.isResizing = false;
  }

  private adjustGridLength<T>(newWidth: number, newHeight: number): Float64Array {

    const adjustedGrid = new Float64Array(newHeight * newWidth * 2);

    const differenceHeight = this.height - newHeight;
    const offsetHeight = Math.floor(differenceHeight / 2);
    const differenceWidth = this.width - newWidth;
    const offsetWidth = Math.floor(differenceWidth / 2);

    for (let x = 0; x < newWidth; x++) {
      for (let y = 0; y < newHeight; y++) {
        if ((x >= offsetWidth && (offsetWidth + x) < this.width) || (y >= offsetHeight && y + offsetHeight < this.height)) {
          const cell = this.getCell(x - offsetWidth, y - offsetHeight);
          this.setCell(x, y, cell, newWidth, adjustedGrid);
          continue;
        }
        this.setCell(x, y, {a: 1, b: 0}, newWidth, adjustedGrid);
      }
    }
    return adjustedGrid;
  }

  public calcNext() {
    if (this.calcRunning || this.isResizing || this.isAddingChemical) {
      return;
    }
    this.calcRunning = true;
    const offsetLength = Math.floor(this.height / this.numberThreads);
    const calcWorkerPromises: Array<Promise<Float64Array>> = [];
    const bufferBytes = this.width * this.height * 2 * Float64Array.BYTES_PER_ELEMENT;

    for (let offsetRow = 0; offsetRow < this.height; offsetRow = offsetRow + offsetLength) {
      const arrayBuffer = new ArrayBuffer(bufferBytes);
      const view = new Float64Array(arrayBuffer);
      view.set(this.grid);
      const offsetLengthAdjusted = (offsetRow + offsetLength) > this.height ? this.height - offsetRow : offsetLength;

      console.log('startWorker: ' + performance.now());
      const promise: Promise<ArrayBuffer> =
        this.webWorkerService.run(this.calcNextWorker, {
          width: this.width,
          height: this.height,
          gridBuffer: view.buffer,
          dA: this.diffRateA,
          dB: this.diffRateB,
          f: this.feedRate,
          k: this.killRate,
          w: this.weights,
          offsetRow: offsetRow,
          offsetLength: offsetLengthAdjusted
        }, [view.buffer]);
      calcWorkerPromises.push(promise.then(buffer => {
        console.log('received result chunk: ' + performance.now());
        return new Float64Array(buffer);
      }));
    }
    Promise.all(calcWorkerPromises).then((result: Float64Array[]) => {
        if (this.isResizing || this.isAddingChemical) {
          this.calcRunning = false;
          return;
        }
        this.grid = new Float64Array(this.grid.length);
        let offset = 0;
        result.forEach((chunk: Float64Array) => {
          console.log('result chunk lengths', chunk.length);
          this.grid.set(chunk, offset);
          offset += chunk.length;
        }, []);

        this.calcRunning = false;
      },
      (error) =>
        console.log('Error endCalculation', error)
    );
  }

  private calcNextWorker(input: CalcNextWebWorkerParam): { data: ArrayBuffer, transferList: ArrayBuffer[] } {
    const {
      width, height, gridBuffer, dA, dB, f,
      k,
      w,
      offsetRow,
      offsetLength
    } = input;
    console.log('worker: buffer received: ' + performance.now());
    const grid = new Float64Array(gridBuffer);

    const nextBuf = new ArrayBuffer(width * offsetLength * 2 * Float64Array.BYTES_PER_ELEMENT);
    const next = new Float64Array(nextBuf);

    const setCell = (column: number, row: number, cell: Cell) => {
      const index = (column + (row - offsetRow) * width) * 2;
      next[index] = cell.a;
      next[index + 1] = cell.b;
    };

    const getCell = (column: number, row: number): Cell => {
      const index = (column + (row) * width) * 2;
      return {
        a: grid[index], b: grid[index + 1]
      };
    };

    /*    const wX = (i) => i < 0 ? width + i : i % width;
        const wY = (j) => j < 0 ? height + j : j % height;*/

    const laplace = (x: number, y: number) => {

      let sumA = 0.0;
      let sumB = 0.0;

      const add = (i, j, weight) => {
        const cell = getCell(i, j);
        sumA += cell.a * weight;
        sumB += cell.b * weight;
      };

      /*add(x, y, w.center);
      add(wX(x - 1), y, w.left);
      add(wX(x + 1), y, w.right);
      add(x, wY(y + 1), w.bottomCenter);
      add(x, wY(y - 1), w.topCenter);
      add(wX(x - 1), wY(y - 1), w.topLeft);
      add(wX(x - 1), wY(y + 1), w.bottomLeft);
      add(wX(x + 1), wY(y - 1), w.topRight);
      add(wX(x + 1), wY(y + 1), w.bottomRight);*/

      add(x, y, w.center);
      add(x - 1, y, w.left);
      add(x + 1, y, w.right);
      add(x, y + 1, w.bottomCenter);
      add(x, y - 1, w.topCenter);
      add(x - 1, y - 1, w.topLeft);
      add(x - 1, y + 1, w.bottomLeft);
      add(x + 1, y - 1, w.topRight);
      add(x + 1, y + 1, w.bottomRight);
      return {sumA, sumB};
    };

    const constrain = (val: number) => Math.min(1.0, Math.max(0.0, val));

    const calcNextCell = (cell: Cell,
                          laplaceA: number,
                          laplaceB: number): Cell => {

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
    };

    for (let x = 0; x < width; x++) {
      for (let y = offsetRow; y < offsetRow + offsetLength; y++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          // the borders are not encounterned;
          setCell(x, y, {a: 0, b: 0});
        } else {
          const lap = laplace(x, y);
          setCell(x, y, calcNextCell(
            getCell(x, y),
            lap.sumA,
            lap.sumB));
        }
      }
    }
    console.log('worker: send back: ' + performance.now());
    return {data: next.buffer, transferList: [next.buffer]};
  }


  addChemical(x, y) {
    this.isAddingChemical = true;
    const halfD = this.addChemicalRadius;
    for (let i = -halfD; i < halfD; i++) {
      for (let j = -halfD; j < halfD; j++) {
        const wrappedX = x + i < 0 ? this.width + i : (x + i) % this.width;
        const wrappedY = y + j < 0 ? this.height + j : (y + j) % this.height;
        const bToAdd = halfD / (i * i + j * j);
        const cell = this.getCell(wrappedX, wrappedY);
        this.setCell(wrappedX, wrappedY, {
          a: cell.a,
          b: Math.min(1.0, Math.max(0.0, cell.b + bToAdd))
        });
      }
    }
    this.isAddingChemical = false;
  }


  public reset() {
    this.init();
  }

}
