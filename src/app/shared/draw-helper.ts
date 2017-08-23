import {Vector} from './vector';
import {Circle} from './circle';


export interface DrawHelper {


  initCtx(ctx: CanvasRenderingContext2D | WebGLRenderingContext): DrawHelper;

  clear(width: number, height: number): DrawHelper;

  setFillColor(fillColor: string): DrawHelper;

  setStrokeColor(strokeColor: string): DrawHelper;

  setLineWidth(lineWidth: number): DrawHelper;

  drawVec(vec: Vector, radius: number): DrawHelper;

  drawPoint(x: number, y: number, radius: number): DrawHelper;

  drawArc(x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise: boolean): DrawHelper;

  drawLine(from: Vector, to: Vector): DrawHelper;

  drawPath(points: Vector[], colorFn?: (vec: Vector) => string): DrawHelper;

  fillRect(x: number, y: number, width: number, height: number): DrawHelper;

  drawCircle(circle: Circle, step: number): DrawHelper ;

}
