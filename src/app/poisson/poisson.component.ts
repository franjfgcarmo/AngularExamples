import {AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Vector} from '../shared/vector';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/shareReplay';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import {PoissonConfigService} from './poisson-config.service';
import {RandomService} from '../shared/random.service';
import {CanvasDrawHelperService} from '../shared/canvas-draw-helper.service';
import {Circle} from '../shared/circle';
import {ok} from 'assert';


@Component({
  selector: 'app-poisson',
  templateUrl: './poisson.component.html',
  styleUrls: ['./poisson.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoissonComponent implements AfterContentInit {

  @ViewChild('canvas') canvas: ElementRef;

  grid: Circle[][] = [];
  active: Vector[] = [];
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  cols: number;
  rows: number;
  step = 0;
  play = false;

  constructor(private poissonConfig: PoissonConfigService, private random: RandomService, private drawHelper: CanvasDrawHelperService) {
    this.width = 800;
    this.height = 600;
    this.rows = Math.floor(this.width / this.poissonConfig.w);
    this.cols = Math.floor(this.height / this.poissonConfig.w);
  }

  ngAfterContentInit(): void {
    this.setup();
    setTimeout(() => this.paintLoop(), 1000);
  }

  setup() {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;

    this.ctx = canvas.getContext('2d');
    this.grid = [];
    this.active = [];

    this.grid = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = new Array<Circle>(this.cols);
    }
    /*    const vec = new Vector(this.width / 2, this.height / 2);
        this.active.push(vec);
        this.addToGrid(vec);*/
    this.step = 0;
  }

  private addToGrid(vec: Vector, circleRadius: number) {
    const x = Math.floor(vec.x / this.poissonConfig.w);
    const y = Math.floor(vec.y / this.poissonConfig.w);

    this.grid[x][y] = new Circle(vec, circleRadius);
  }

  private getFromGrid(vec: Vector): Circle {
    const x = Math.floor(vec.x / this.poissonConfig.w);
    const y = Math.floor(vec.y / this.poissonConfig.w);
    return this.grid[x][y];
  }

  reset(): void {
    this.setup();
  }

  paintLoop(): void {
    this.drawStep(this.step);
    if (this.play) {
      this.step++;
      for (let f = 0; f < this.poissonConfig.iterationsPerFrame && this.active.length > 0; f++) {
        const randActiveIndex = Math.floor(this.random.randomTo(this.active.length));
        const pos = this.active[randActiveIndex];
        let found = false;
        const radius = this.currentDistanceForPos(pos);
        for (let n = 0; n < this.poissonConfig.k; n++) {
          const sample = Vector.randomVec().setMag(this.random.random(radius, 2 * radius)).add(pos);
          this.ctx.fillStyle = 'blue';
          this.drawHelper.drawVec(sample, radius * 0.2, this.ctx);

          const row = Math.floor(sample.x / this.poissonConfig.w);
          const col = Math.floor(sample.y / this.poissonConfig.w);

          if (col > -1 && row > -1 && col < this.cols && row < this.rows && !this.getFromGrid(sample)) {

            this.ctx.fillStyle = 'yellow';
            this.drawHelper.drawVec(pos, radius * 0.2, this.ctx);
            const neighbours = this.getNeighbours(sample, radius);
            const ok = neighbours.every((neighbour: Circle) => {
              this.ctx.strokeStyle = 'white';
              if (neighbour) {
                this.ctx.lineWidth = 0.5;
                this.drawHelper.drawLine(sample, neighbour.pos, this.ctx);
                this.ctx.fillStyle = 'green';
                neighbour.draw(this.step, this.ctx);
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

  private currentDistance() {
    return this.poissonConfig.r;
  }

  private currentDistanceForPos(pos: Vector) {
    return this.poissonConfig.r * (1 + 2 * Math.abs(Math.sin((pos.x + pos.y) * 0.01)));
  }

  private drawStep(step: number = this.step, radius: number = this.poissonConfig.r) {
    this.ctx.fillStyle = 'black';
    this.ctx.globalAlpha = 0.2;
    // this.ctx.fillRect(0, 0, this.width, this.height);

    const hue = 255 * Math.abs(Math.sin(step * 0.01));
    const sat = 255 * Math.abs(Math.cos(step * 0.02));

    this.grid.forEach(circles => circles.forEach((circle) => {
        if (circle) {
          this.ctx.fillStyle = `hsl(${hue},${sat}%,s%)`;
          circle.draw(this.step, this.ctx);
        }
      }
    ));

    this.ctx.fillStyle = 'red';
    this.active.forEach((vec) => {
      this.drawHelper.drawVec(vec, this.poissonConfig.r * 0.2, this.ctx);
    });
  }

  getNeighbours(vec: Vector, distance: number = this.poissonConfig.r): Circle[] {
    const cellWidth = this.poissonConfig.w;
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
    const rowW = this.poissonConfig.w * dr;
    const colW = this.poissonConfig.w * dc;
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
