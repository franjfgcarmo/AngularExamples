import {Point} from '../shared/point';
import {Perceptron} from '../shared/perceptron';

export class DataP5Scetch {

  public points: Point[] = [];
  public perceptron: Perceptron;

  constructor(private p: any,
              private width: number = 400,
              private height: number = 400,
              private onClickHandler: (x: number, y: number, click: 'left' | 'right') => void) {
    p.setup = this.setup.bind(this);
    p.draw = this.draw.bind(this);
    p.mousePressed = this.mouseClicked.bind(this);
  }

  setup() {
    this.p.createCanvas(this.width, this.height);
  }

  draw() {
    if (this.perceptron) {
      this.p.background(255);
      this.p.strokeWeight(1);
      this.points.forEach(point => point.show(this.p));
      this.p.stroke(0);
      this.p.line(0, 0, this.p.width, this.p.height);

      this.points.forEach(point => {
        const result = this.perceptron.guessSilent(point.data);
        point.showForResult(this.p, result);
      });

      this.drawSeparationLine();
    }
  }

  mouseClicked() {
    if (this.onClickHandler) {
      const mouseX = this.p.mouseX;
      const mouseY = this.p.mouseY;

      if (mouseX > 0 && mouseY > 0 && mouseX <= this.width && mouseY <= this.p.height) {
        let mouseButton: 'left' | 'right';
        if (this.p.mouseButton === this.p.LEFT) {
          mouseButton = 'left';
        }
        if (this.p.mouseButton === this.p.RIGHT) {
          mouseButton = 'right';
        }
        this.onClickHandler(mouseX, mouseY, mouseButton);
        return false;
      }
    }
  }

  private drawSeparationLine() {
    const classSeparatorLine = this.perceptron.classSeparatorLine;
    const y0 = classSeparatorLine.y0 * this.height;
    const y1 = this.width * classSeparatorLine.y1;

    this.p.stroke(255, 200, 200);
    this.p.strokeWeight(3);
    this.p.line(0, y0, this.width, y1);
    this.p.strokeWeight(1);
  }
}
