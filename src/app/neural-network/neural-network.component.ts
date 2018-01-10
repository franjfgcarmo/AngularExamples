import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as p5 from 'p5';
import {PerceptronP5Scetch} from './perceptron-p5-scetch';
import {Perceptron} from './perceptron';
import {Point} from './point';

@Component({
  selector: 'app-neural-network',
  templateUrl: './neural-network.component.html',
  styleUrls: ['./neural-network.component.css']
})
export class NeuralNetworkComponent implements AfterContentInit {

  @ViewChild('perceptronCanvas') private perceptronCanvas: ElementRef;
  private p: any;
  public perceptron: Perceptron;
  private points: Point[] = new Array<Point>(100);
  private perceptronScetch: PerceptronP5Scetch;

  constructor() {
  }

  ngAfterContentInit() {
    for (let i = 0; i < 100; i++) {
      this.points[i] = new Point();
    }
    this.perceptron = new Perceptron(2);

    this.p = new p5((p) => {
      this.perceptronScetch = new PerceptronP5Scetch(p, this.points, this.perceptron);
    }, this.perceptronCanvas.nativeElement);
  }

  train() {
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.random() * this.points.length;
      const point = this.points[Math.floor(randomIndex)];
      this.perceptron.train({inputs: point.data, expected: point.label});
    }
  }

  test() {
    for (let i = this.points.length - 1; i >= 0; i--) {
      this.points[i] = new Point();
    }
  }

}
