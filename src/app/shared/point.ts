import {Vector} from './vector';

export class Circle {
  constructor(public pos: Vector, public r: number) {
  }

  draw(step: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const offsetX = this.pos.x * 0.01 * Math.sin(step);
    const offsetY = this.pos.y * 0.01 * Math.sin(step);
    ctx.arc(this.pos.x + offsetX, this.pos.y + offsetY, this.r, 0, 2 * Math.PI, true);
    ctx.fill();
  }
}

