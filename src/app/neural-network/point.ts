export class Point {
  public label: number;

  constructor(private x: number = Math.random(), private y: number = Math.random()) {
    this.label = this.x > this.y ? 1 : -1;
  }

  get data(): number[] {
    return [this.x, this.y];
  }

  show(p: any) {
    p.stroke(0);
    p.fill(this.label === 1 ? 255 : 0);
    p.ellipse(this.x * p.width, this.y * p.height, 8, 8);
  }

  showForResult(p: any, result: number) {
    p.noStroke();
    if (Math.sign(result) === this.label) {
      p.fill(0, 255, 0);
    } else {
      p.fill(255, 0, 0);
    }
    p.ellipse(this.x * p.width, this.y * p.height, 4, 4);
  }
}
