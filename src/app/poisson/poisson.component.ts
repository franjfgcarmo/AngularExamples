import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  OnInit, Inject
} from '@angular/core';
import {Vector} from '../shared/vector';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/count';
import {PoissonConfigService} from './poisson-config.service';
import {RandomService} from '../shared/random.service';
import {Circle} from '../shared/circle';
import {Subscription} from 'rxjs/Subscription';
import {DrawHelper} from '../shared/draw-helper';
import {DRAW_HELPER} from '../shared/shared.module';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-poisson',
  templateUrl: './poisson.component.html',
  styleUrls: ['./poisson.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoissonComponent implements AfterContentInit, OnInit, OnDestroy {

  r: any;
  k: any;

  @ViewChild('canvas') canvas: ElementRef;

  width = 500;
  height = 500;

  foundCirclesSubject: Subject<Circle>;
  foundCircles$: Observable<Circle[]>;
  grid: Circle[][] = [];
  active: Vector[] = [];

  cols: number;
  rows: number;
  stepSubject: Subject<void>;
  step$: Observable<number>;

  play = false;
  iterationsPerFrame: number;
  w: number;
  private subscriptions: Subscription;

  constructor(private poissonConfig: PoissonConfigService,
              private random: RandomService,
              @Inject(DRAW_HELPER) private drawHelper: DrawHelper) {
  }

  ngOnInit(): void {

    this.subscriptions = (this.poissonConfig.iterationsPerFrame$.subscribe((iterations) => this.iterationsPerFrame = iterations))
      .add(this.poissonConfig.k$.subscribe((k) => this.k = k))
      .add(this.poissonConfig.r$.subscribe((r) => this.r = r))
      .add(this.poissonConfig.w$.subscribe((w) => this.w = w));

    this.rows = Math.floor(this.width / this.w);
    this.cols = Math.floor(this.height / this.w);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.setup();
      this.paintLoop();
    }, 0);
  }

  setup() {
    /*const canvas: HTMLCanvasElement = this.canvas.nativeElement;

    const ctx = canvas.getContext('2d');
    this.drawHelper.initCtx(ctx);*/
    this.grid = [];
    this.active = [];

    this.grid = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = new Array<Circle>(this.cols);
    }

    this.stepSubject = new Subject<void>();
    this.step$ = this.stepSubject.scan((prev, ignored) => prev + 1, 0);

    if (!this.foundCirclesSubject || this.foundCirclesSubject.isStopped) {
      this.foundCirclesSubject = new Subject<Circle>();
      this.foundCircles$ = this.foundCirclesSubject.asObservable()
        .map((circle: Circle) => new Circle(circle.pos.add(-this.width / 2, -this.height / 2), circle.r))
        .scan((pre: Circle[], current: Circle) => {
          pre.push(current);
          return pre;
        }, []);

      /*this.drawHelper.setFillColor('black');
      this.drawHelper.fillRect(0, 0, this.width, this.height);*/

    }
  }

  private addToGrid(vec: Vector, circleRadius: number) {
    const x = Math.floor(vec.x / this.w);
    const y = Math.floor(vec.y / this.w);

    const circle = new Circle(vec, circleRadius);
    this.grid[x][y] = circle;
    this.foundCirclesSubject.next(circle);
  }

  private getFromGrid(vec: Vector): Circle {
    const x = Math.floor(vec.x / this.w);
    const y = Math.floor(vec.y / this.w);
    return this.grid[x][y];
  }

  reset(): void {
    this.foundCirclesSubject.complete();
    this.setup();
  }

  paintLoop(): void {
    // this.drawStep(this.step);
    this.stepSubject.next();
    if (this.play) {
      for (let f = 0; f < this.iterationsPerFrame && this.active.length > 0; f++) {
        const randActiveIndex = Math.floor(this.random.randomTo(this.active.length));
        const pos = this.active[randActiveIndex];
        let found = false;
        const radius = this.currentDistanceForPos(pos);
        for (let n = 0; n < this.k; n++) {
          const sample = Vector.randomVec().setMag(this.random.random(radius, 2 * radius)).addVec(pos);
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
              this.active.push(sample);
            }
          }
        }
        if (!found) {
          this.active.splice(randActiveIndex, 1);
        }
      }
    }
    requestAnimationFrame(() => this.paintLoop());
  }

  private currentCircleRadius(vector) {
    const radius = this.currentDistanceForPos(vector);
    return radius * 0.2;
  }

  private currentDistanceForPos(pos: Vector) {
    return this.r * (1 + 2 * Math.abs(Math.sin((pos.x + pos.y) * 0.01)));
  }

  private drawStep(step: number, radius: number = this.r) {
    this.drawHelper.clear(this.width, this.height);

    this.grid.forEach(circles => circles.forEach((circle) => {
        if (circle) {
          this.drawHelper.drawCircle(circle, 0);
        }
      }
    ));

    this.drawHelper.setFillColor('red');
    this.active.forEach((vec) => {
      this.drawHelper.drawVec(vec, this.r * 0.2);
    });
  }

  getNeighbours(vec: Vector, distance: number = this.r): Circle[] {
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

  private isInDistanceFactory(row, col, distance) {
    return (rowToCheck: number, colToCheck: number) =>
      this.isInDistance(rowToCheck - row, colToCheck - col, distance);
  }

  private isInDistance(dr, dc, distance): boolean {
    const rowW = this.w * dr;
    const colW = this.w * dc;
    return distance * distance >= rowW * rowW + colW * colW;
  }

  addPoint($event: MouseEvent) {
    const vector = new Vector($event.offsetX, $event.offsetY);
    this.addToGrid(vector, this.currentCircleRadius(vector));
    this.active.push(vector);
  }

  setPlay(play: boolean) {
    this.play = play;
  }
}
