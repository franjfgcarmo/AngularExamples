import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BrainService} from './brain.service';
import {Point} from './shared/point';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-neural-network',
  templateUrl: './neural-network.component.html',
  styleUrls: ['./neural-network.component.less']
})
export class NeuralNetworkComponent implements OnInit {

  width = 400;
  height = 400;

  private autoLearning$: Observable<boolean>;

  constructor(private brainService: BrainService) {
  }

  get perceptron() {
    return this.brainService.perceptron;
  }

  get points() {
    return this.brainService.points;
  }

  get learnRate() {
    return this.brainService.learnRate;
  }

  get learnedDataPoints() {
    return this.brainService.learnedDataPoints;
  }

  ngOnInit(): void {
    this.brainService.createPerceptron(2);
    this.brainService.updateTrainingData();
    this.autoLearning$ = this.brainService.autoLearning$;
  }

  train() {
    this.brainService.train();
  }

  testAgainstNewData() {
    this.brainService.updateTrainingData();
  }

  toggleAutoLearning($event: boolean) {
    this.brainService.toggleAutoTraining($event);
  }

  addPoint({x, y}: { x: number, y: number }) {
    const point = new Point(x / this.width, y / this.height);
    this.brainService.addPoint(point);
  }

  resetPerceptron() {
    this.brainService.createPerceptron();
  }
}

