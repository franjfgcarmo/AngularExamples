import {Injectable} from '@angular/core';
import {Vector} from './vector';
import {DrawHelper} from './draw-helper';
import {Circle} from './circle';
import init from './init-gl';

@Injectable()
export class CanvasDrawHelperServiceWebGl implements DrawHelper {


  private gl: WebGLRenderingContext;

  constructor() {
  }


  initCtx(webGl: WebGLRenderingContext): DrawHelper {
    this.gl = webGl;
    init(this.gl);
    return this;
  }

  setFillColor(fillColor: string): DrawHelper {
    // this.gl.fillStyle = fillColor;
    return this;
  }

  setStrokeColor(strokeColor: string): DrawHelper {
    // this.gl.strokeStyle = strokeColor;
    return this;
  }

  setLineWidth(lineWidth: number): DrawHelper {
    // this.gl.lineWidth = lineWidth;
    return this;
  }

  drawCircle(circle: Circle, step: number): DrawHelper {
    const offsetX = 0;
    const offsetY = 0;
    const hue = 255 * Math.abs(Math.sin((step + circle.pos.x) * 0.03));
    const sat = 255 * Math.abs(Math.cos(circle.r));

    return this;
    /*.setFillColor(`hsl(${hue},${sat}%,50%)`)
    .drawPoint(circle.pos.x + offsetX, circle.pos.y + offsetY, circle.r)*/
  }

  drawVec(vec: Vector, radius: number) {
    return this.drawPoint(vec.x, vec.y, radius);
  }

  drawPoint(x: number, y: number, radius: number) {
    return this.drawArc(x, y, radius, 0, 2 * Math.PI, true);
  }

  drawLine(from: Vector, to: Vector) {
    /* this.gl.beginPath();
     this.gl.moveTo(from.x, from.y);
     this.gl.lineTo(to.x, to.y);
     this.gl.stroke();*/
    return this;
  }

  drawPath(points: Vector[], colorFn ?: (vec: Vector) => string) {
    /*this.gl.moveTo(points[0].x, points[0].y);
    this.gl.beginPath();
    points.forEach((vec) => this.gl.lineTo(vec.x, vec.y));
    this.gl.closePath();
    this.gl.stroke();*/
    return this;
  }

  drawArc(x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise: boolean) {
    /*this.gl.beginPath();
    this.gl.arc(x, y, r, startAngle, endAngle, anticlockwise);
    this.gl.fill();*/
    return this;
  }

  clear(width: number, height: number): DrawHelper {
    // Set clear color to black, fully opaque
    /*this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);*/
    return this;
  }

  fillRect(x: number, y: number, width: number, height: number): DrawHelper {
    // this.gl.fillRect(x, y, width, height);
    return this;
  }
}