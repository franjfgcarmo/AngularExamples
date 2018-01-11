import {Injectable} from '@angular/core';
import {Perceptron} from './perceptron';
import {Point} from './point';
import {TrainDataService} from './train-data.service';
import {Subject} from 'rxjs/Subject';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {filter, repeat, skipUntil, takeUntil} from 'rxjs/operators';

const defaultLearnRate = 0.3;

@Injectable()
export class BrainService {

  private _learnRate = defaultLearnRate;
  private learnedDataPoints = 0;

  public points: Point[] = [];
  public perceptron: Perceptron;

  private autoLearningSubject = new Subject<boolean>();
  private startAutoLearning$ = this.autoLearningSubject.pipe(filter(autoLearningEnabled => autoLearningEnabled));
  private stopAutoLearning$ = this.autoLearningSubject.pipe(filter(autoLearningEnabled => !autoLearningEnabled));

  public autoLearning$ = IntervalObservable.create(50).pipe(
    skipUntil(this.startAutoLearning$),
    takeUntil(this.stopAutoLearning$),
    repeat()
  );

  constructor(private trainDataService: TrainDataService) {
    this.autoLearning$.subscribe(() => this.train(1));
  }

  get learnRate() {
    return this._learnRate;
  }

  set learnRate(learnRate: number) {
    this._learnRate = learnRate;
  }

  createPerceptron(inputDimensions: number = 2): Perceptron {
    this.learnedDataPoints = 0;
    this.learnRate = defaultLearnRate;
    this.perceptron = new Perceptron(2);
    return this.perceptron;
  }

  train(randomDataPointsToTest: number = 10) {
    if (this.perceptron == null) {
      this.createPerceptron(2);
    }

    if (this.points == null || this.points.length === 0) {
      this.updateTrainingData();
    }

    for (let i = 0; i < randomDataPointsToTest; i++) {
      const randomIndex = Math.random() * this.points.length;
      const point = this.points[Math.floor(randomIndex)];
      const error = this.perceptron.train(point.trainData, this.learnRate);
      if (error !== 0.0) {
        this.learnedDataPoints++;
        this._learnRate = Math.max(this.learnRate * (1 - this.learnedDataPoints / 1000), 0.005);
      }
    }
  }

  updateTrainingData(): Point[] {
    this.points = this.trainDataService.createTestData(100);
    return this.points;
  }

  guess(input: number[]): number {
    return this.perceptron.guess(input);
  }

  toggleAutoTraining(autoTrainingEnabled: boolean) {
    this.autoLearningSubject.next(autoTrainingEnabled);
  }

  addPoint(point: Point) {
    this.points.push(point);
    this.perceptron.guess(point.data);
  }
}
