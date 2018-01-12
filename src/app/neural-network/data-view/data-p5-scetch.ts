import {Point} from '../shared/point';
import {Perceptron} from '../shared/perceptron';

export class DataP5Scetch {

  public points: Point[] = [];
  public perceptron: Perceptron;

  constructor(private p: any,
              private width: number = 400,
              private height: number = 400,
              private onClickHandler: (x: number, y: number) => void) {
    p.setup = this.setup.bind(this);
    p.draw = this.draw.bind(this);
    p.mouseClicked = this.mouseClicked.bind(this);
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
      const y0 = (this.perceptron.bias * this.height) / -this.perceptron.weights[1];
      const yWidth = this.width * (this.perceptron.weights[0] + this.perceptron.bias) / -this.perceptron.weights[1];

      this.p.line(0, y0, this.width, yWidth);
    }
  }

  mouseClicked() {
    if (this.onClickHandler) {
      const mouseX = this.p.mouseX;
      const mouseY = this.p.mouseY;
      if (mouseX > 0 && mouseY > 0 && mouseX <= this.width && mouseY <= this.p.height) {
        this.onClickHandler(mouseX, mouseY);
        return false;
      }
    }
  }
}
