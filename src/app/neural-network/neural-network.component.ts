import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as p5 from 'p5';
import {PerceptronP5Scetch} from './data-p5-scetch';
import {BrainService} from './brain.service';
import {TrainDataService} from './train-data.service';
import {Point} from './point';

@Component({
  selector: 'app-neural-network',
  templateUrl: './neural-network.component.html',
  styleUrls: ['./neural-network.component.css']
})
export class NeuralNetworkComponent implements OnInit, AfterContentInit {


  @ViewChild('perceptronCanvas') private perceptronCanvas: ElementRef;
  private p: any;
  private perceptronScetch: PerceptronP5Scetch;
  private autoLearning: false;
  private width = 400;
  private height = 400;

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

  ngOnInit(): void {
    console.log('onInit');
    this.brainService.createPerceptron(2);
    this.brainService.updateTrainingData();
  }

  ngAfterContentInit(): void {
    console.log('afterContentInit');
    this.p = new p5((p) => {
      this.perceptronScetch = new PerceptronP5Scetch(p, this.width, this.height, (x, y) => this.addPoint(x, y));
    }, this.perceptronCanvas.nativeElement);

    this.perceptronScetch.points = this.points;
    this.perceptronScetch.perceptron = this.perceptron;
  }

  train() {
    this.brainService.train();
  }

  testAgainstNewData() {
    this.brainService.updateTrainingData();
    this.perceptronScetch.points = this.points;
  }

  toggleAutoLearning() {
    this.brainService.toggleAutoTraining(this.autoLearning);
  }

  private addPoint(x: number, y: number) {
    const point = new Point(x / this.width, y / this.height);
    this.brainService.addPoint(point);
  }

  resetPerceptron() {
    this.brainService.createPerceptron();
    this.perceptronScetch.perceptron = this.perceptron;
  }
}

