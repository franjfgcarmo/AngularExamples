import {Vector} from './vector';

export class Circle {
  constructor(public pos: Vector, public r: number) {
  }

  draw(step: number, ctx: CanvasRenderingContext2D) {
    const offsetX = 0;
    const offsetY = 0;
    const hue = 255 * Math.abs(Math.sin((step + this.pos.x) * 0.03));
    const sat = 255 * Math.abs(Math.cos(this.r));

    ctx.fillStyle = `hsl(${hue},${sat}%,50%)`;
    ctx.beginPath();
    ctx.arc(this.pos.x + offsetX, this.pos.y + offsetY, this.r, 0, 2 * Math.PI, true);
    ctx.fill();
  }

}

