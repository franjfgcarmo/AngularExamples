import {Injectable} from '@angular/core';
import {Vector} from './vector';
import {DrawHelper} from './draw-helper';
import {Circle} from './circle';

@Injectable()
export class CanvasDrawHelperService implements DrawHelper {


  private ctx: CanvasRenderingContext2D;

  constructor() {
  }


  initCtx(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    return this;
  }

  setFillColor(fillColor: string) {
    this.ctx.fillStyle = fillColor;
    return this;
  }

  setStrokeColor(strokeColor: string) {
    this.ctx.strokeStyle = strokeColor;
    return this;
  }

  setLineWidth(lineWidth: number) {
    this.ctx.lineWidth = lineWidth;
    return this;
  }

  drawCircle(circle: Circle, step: number): DrawHelper {
    const offsetX = 0;
    const offsetY = 0;
    const hue = 255 * Math.abs(Math.sin((step + circle.pos.x) * 0.03));
    const sat = 255 * Math.abs(Math.cos(circle.r));

    return this
      .setFillColor(`hsl(${hue},${sat}%,50%)`)
      .drawPoint(circle.pos.x + offsetX, circle.pos.y + offsetY, circle.r);
  }

  drawVec(vec: Vector, radius: number) {
    return this.drawPoint(vec.x, vec.y, radius);
  }

  drawPoint(x: number, y: number, radius: number) {
    return this.drawArc(x, y, radius, 0, 2 * Math.PI, true);
  }

  drawLine(from: Vector, to: Vector) {
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
    return this;
  }

  drawPath(points: Vector[], colorFn?: (vec: Vector) => string) {
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.beginPath();
    points.forEach((vec) => this.ctx.lineTo(vec.x, vec.y));
    this.ctx.closePath();
    this.ctx.stroke();
    return this;
  }

  drawArc(x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise: boolean) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, startAngle, endAngle, anticlockwise);
    this.ctx.fill();
    return this;
  }

  clear(width: number, height: number) {
    return this.setFillColor('black').fillRect(0, 0, width, height);
  }

  fillRect(x: number, y: number, width: number, height: number) {
    this.ctx.fillRect(x, y, width, height);
    return this;
  }
}
