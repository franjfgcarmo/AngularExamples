import {Injectable} from '@angular/core';
import {PoissonConfigService} from './poisson-config.service';
import {Circle} from './shared/circle';
import {Subject} from 'rxjs/Subject';
import {Observable, Subscribable} from 'rxjs/Observable';
import {Vector} from './shared/vector';
import {RandomService} from '../shared/random.service';
import {Subscription} from 'rxjs/Subscription';
import {ShapeFactoryService} from './shared/shape-factory.service';

@Injectable()
export class PoissonCalcServiceService {
  private height: number;
  private width: number;

  private r: number;
  private k: number;
  private w: number;

  private cols: number;
  private rows: number;

  private grid: Circle[][] = [];
  private active: Vector[] = [];

  private foundCirclesSubject: Subject<Circle>;
  public foundCircles$: Observable<Circle[]>;

  private activesSubject: Subject<Vector[]>;
  public activeVectors$: Observable<Vector[]>;

  private iterationsPerFrame: number;
  private subscriptions: Subscription;

  constructor(private poissonConfig: PoissonConfigService, private random: RandomService, private shapeFactory: ShapeFactoryService) {
    this.subscriptions = (this.poissonConfig.iterationsPerFrame$.subscribe((iterations) => this.iterationsPerFrame = iterations))
      .add(this.poissonConfig.k$.subscribe((k) => this.k = k))
      .add(this.poissonConfig.r$.subscribe((r) => this.r = r));
    this.w = this.poissonConfig.w;
  }

  public setup(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.rows = Math.floor(this.width / this.w);
    this.cols = Math.floor(this.height / this.w);
    this.grid = [];
    this.active = [];

    this.grid = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = new Array<Circle>(this.cols);
    }

    if (this.foundCirclesSubject) {
      this.foundCirclesSubject.complete();
    }
    this.foundCirclesSubject = new Subject<Circle>();
    this.foundCircles$ = this.foundCirclesSubject.asObservable()
      .scan((pre: Circle[], current: Circle) => {
        pre.push(current);
        return pre;
      }, []);

    if (this.activesSubject) {
      this.activesSubject.complete();
    }
    this.activesSubject = new Subject<Vector[]>();
    this.activeVectors$ = this.activesSubject.asObservable();
  }

  calculate() {
    for (let f = 0; f < this.iterationsPerFrame && this.active.length > 0; f++) {
      const randActiveIndex = Math.floor(this.random.randomTo(this.active.length));
      const pos = this.active[randActiveIndex];
      let found = false;
      const radius = this.currentDistanceForPos(pos);
      for (let n = 0; n < this.k; n++) {
        const sample = this.shapeFactory.randomVector().setMag(this.random.random(radius, 2 * radius)).addVec(pos);
        /*this.drawHelper
          .setFillColor('blue')
          .drawVec(sample, radius * 0.2);*/

        const row = Math.floor(sample.x / this.w);
        const col = Math.floor(sample.y / this.w);

        if (col > -1 && row > -1 && col < this.cols && row < this.rows && !this.getFromGrid(sample)) {

          /*this.drawHelper
            .setFillColor('yellow')
            .drawVec(pos, radius * 0.2);*/
          const neighbours = this.getNeighbours(sample, radius);
          const ok = neighbours.every((neighbour: Circle) => {
            // this.drawHelper.setStrokeColor('white');
            if (neighbour) {
              /*  this.drawHelper
                  .setLineWidth(0.5)
                  .drawLine(sample, neighbour.pos)
                  .setFillColor('green')
                  .drawCircle(neighbour, this.step);
*/
              const d = sample.fastDist(neighbour.pos);
              const rQuad = radius * radius;
              return d >= rQuad;
            }
          });

          if (ok) {
            found = true;
            this.addToGrid(sample, this.currentCircleRadius(sample));
            this.addToActive(sample);
          }
        }
      }
      if (!found) {
        this.removeFromActive(randActiveIndex);
      }
    }
  }

  private getFromGrid(vec: Vector): Circle {
    const x = Math.floor(vec.x / this.w);
    const y = Math.floor(vec.y / this.w);
    return this.grid[x][y];
  }

  public addPointForCalculation(vec: Vector) {
    this.addToGrid(vec);
    this.addToActive(vec);
  }

  private addToGrid(vec: Vector, circleRadius: number = this.currentCircleRadius(vec)) {
    const x = Math.floor(vec.x / this.w);
    const y = Math.floor(vec.y / this.w);

    const circle = new Circle(vec, circleRadius);
    this.grid[x][y] = circle;
    this.foundCirclesSubject.next(circle);
  }

  private getNeighbours(vec: Vector, distance: number = this.r): Circle[] {
    const cellWidth = this.w;
    const row = Math.floor(vec.x / cellWidth);
    const col = Math.floor(vec.y / cellWidth);
    const distanceCheck = this.isInDistanceFactory(row, col, distance);
    const result: Circle[] = [];

    this.grid.forEach((colVecs: Circle[], rowToCheck: number) =>
      colVecs.forEach((neighbour: Circle, colToCheck: number) => {
        if (distanceCheck(rowToCheck, colToCheck)) {
          result.push(neighbour);
        }
      }));
    return result;
  }

  private currentCircleRadius(vector) {
    const radius = this.currentDistanceForPos(vector);
    return radius * 0.2;
  }

  private currentDistanceForPos(pos: Vector) {
    return this.r * (1 + 2 * Math.abs(Math.sin((pos.x + pos.y) * 0.01)));
  }

  private isInDistanceFactory(row, col, distance) {
    return (rowToCheck: number, colToCheck: number) =>
      this.isInDistance(rowToCheck - row, colToCheck - col, distance);
  }

  private isInDistance(dr, dc, distance): boolean {
    const rowW = this.w * dr;
    const colW = this.w * dc;
    return distance * distance >= rowW * rowW + colW * colW;
  }

  private addToActive(vec: Vector) {
    this.active.push(vec);
    this.activesSubject.next(this.active);
  }

  private removeFromActive(index: number) {
    this.active.splice(index, 1);
    this.activesSubject.next(this.active);
  }
}
