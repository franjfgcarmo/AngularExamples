import {Point} from './point';
import {Perceptron} from './perceptron';

export class PerceptronP5Scetch {

  constructor(private p: any, private points: Point[],
              private perceptron: Perceptron,
              private width: number = 300,
              private height: number = 300) {
    p.setup = this.setup.bind(this);
    p.draw = this.draw.bind(this);
  }

  setup() {
    this.p.createCanvas(this.width, this.height);
  }

  draw() {
    this.p.background(255);
    this.points.forEach(point => point.show(this.p));
    this.p.stroke(0);
    this.p.line(0, 0, this.p.width, this.p.height);

    this.points.forEach(point => {
      const result = this.perceptron.guess(point.data);
      point.showForResult(this.p, result);
    });
  }


}
