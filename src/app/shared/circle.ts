import {Vector} from './vector';

export class Circle {
  constructor(public pos: Vector, public r: number) {
  }

  draw(step: number, ctx: CanvasRenderingContext2D) {
    const offsetX = 0;
    const offsetY = 0;
    ctx.beginPath();
    ctx.arc(this.pos.x + offsetX, this.pos.y + offsetY, this.r, 0, 2 * Math.PI, true);
    ctx.fill();
  }

  lineToNeighbour(neighbour: Circle){

  }
}

