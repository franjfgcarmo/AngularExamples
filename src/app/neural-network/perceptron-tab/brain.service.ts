import {Injectable} from '@angular/core';
import {TrainDataService} from '../shared/train-data.service';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {distinctUntilChanged, filter, repeat, skipUntil, startWith, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Point} from '../shared/point';
import {Perceptron} from '../shared/perceptron';

const defaultLearnRate = 0.3;

@Injectable()
export class BrainService {

  learnedDataPoints = 0;
  points: Point[] = [];
  perceptrons: Perceptron[][];

  private _learnRate = defaultLearnRate;
  private autoLearningSubject = new Subject<boolean>();
  private startAutoLearning$ = this.autoLearningSubject.pipe(filter(autoLearningEnabled => autoLearningEnabled));
  private stopAutoLearning$ = this.autoLearningSubject.pipe(filter(autoLearningEnabled => !autoLearningEnabled));

  private autoLearner$ = IntervalObservable.create(50).pipe(
    distinctUntilChanged(),
    skipUntil(this.startAutoLearning$),
    takeUntil(this.stopAutoLearning$),
    repeat()
  );

  constructor(private trainDataService: TrainDataService) {
    this.autoLearner$.subscribe(() => this.train());
  }

  get autoLearning$(): Observable<boolean> {
    return this.autoLearningSubject.asObservable().pipe(startWith(false));
  }

  get learnRate() {
    return this._learnRate;
  }

  set learnRate(learnRate: number) {
    this._learnRate = learnRate;
  }

  createPerceptron(inputDimensions: number = 2): Perceptron {
    this.createMultiPerceptron(inputDimensions, [1]);
    return this.perceptrons[0][0];
  }

  createMultiPerceptron(inputDimensions: number = 2, amountPerceptronsPerLayer: number[] = [3, 1]): Perceptron[][] {
    this.learnedDataPoints = 0;
    this.learnRate = defaultLearnRate;
    this.perceptrons = amountPerceptronsPerLayer.map((amountPerLayer, index) => {
      const layer = [];
      for (let i = 0; i < amountPerLayer; i++) {
        layer.push(new Perceptron(index > 0 ? amountPerceptronsPerLayer[index - 1] : inputDimensions));
      }
      return layer;
    });
    return this.perceptrons;
  }

  train(randomDataPointsToTest: number = 10) {
    if (this.points == null) {
      this.updateTrainingData();
    }

    if (this.points.length === 0) {
      return;
    }

    for (let i = 0; i < randomDataPointsToTest; i++) {
      const randomIndex = Math.random() * this.points.length;
      const point = this.points[Math.floor(randomIndex)];
      const error = this.perceptrons[0][0].train(point.trainData, this.learnRate);
      if (error !== 0.0) {
        this.learnedDataPoints++;
        this._learnRate = Math.max(this.learnRate * (1 - this.learnedDataPoints / 1000), 0.0005);
      }
    }
  }

  updateTrainingData(): Point[] {
    this.points = this.trainDataService.createTestData(100);
    return this.points;
  }

  guess(input: number[]): number {
    if (this.perceptrons.length > 1) {
      let layerResult = [...input];

      for (let i = 0; i < this.perceptrons.length - 1; i++) {
        layerResult = this.perceptrons[i].map(perceptron =>
          perceptron.guessSig(layerResult)
        );
      }
      // last layer should always be only one output perceptron
      return this.perceptrons[this.perceptrons.length - 1][0].guessSig(layerResult);
    }
    return this.perceptrons[0][0].guess(input);
  }

  toggleAutoTraining(autoTrainingEnabled: boolean) {
    this.autoLearningSubject.next(autoTrainingEnabled);
  }

  addPoint(point: Point) {
    this.points.push(point);
    this.guess(point.data);
  }

  clearPoints() {
    this.points = [];
  }
}
