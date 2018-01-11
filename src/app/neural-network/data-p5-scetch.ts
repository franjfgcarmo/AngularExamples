import {Point} from './point';
import {Perceptron} from './perceptron';

export class PerceptronP5Scetch {

  public points: Point[] = [];
  public perceptron: Perceptron;

  constructor(private p: any,
              private width: number = 300,
              private height: number = 300,
              private onClickHandler: (x: number, y: number) => void) {
    p.setup = this.setup.bind(this);
    p.draw = this.draw.bind(this);
    p.mousePressed = this.mousePressed.bind(this);
  }

  setup() {
    this.p.createCanvas(this.width, this.height);
  }

  draw() {
    if (this.perceptron) {
      this.p.background(255);
      this.points.forEach(point => point.show(this.p));
      this.p.stroke(0);
      this.p.line(0, 0, this.p.width, this.p.height);

      this.points.forEach(point => {
        const result = this.perceptron.guessSilent(point.data);
        point.showForResult(this.p, result);
      });

      this.p.stroke(255, 200, 200);
      const y0 = (this.perceptron.bias * this.width) / -this.perceptron.weights[1];
      const yWidth = this.width * (this.perceptron.weights[0] + this.perceptron.bias) / -this.perceptron.weights[1];

      this.p.line(0, y0, this.width, yWidth);

    }
  }

  mousePressed() {
    if (this.onClickHandler) {
      this.onClickHandler(this.p.mouseX, this.p.mouseY);
    }
  }
}
