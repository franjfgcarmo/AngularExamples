import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/shareReplay';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import {NullVec, Vector} from './vector';

const r = 20;
const k = 30;
const w = () => r / Math.sqrt(2.);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {

  @ViewChild('canvas') canvas: ElementRef;
  title = 'POISON';
  grid: Vector[] = [];
  active: Vector[] = [];
  ctx: CanvasRenderingContext2D;
  height = 800;
  width = 800;
  cols: number = Math.floor(this.width / w());
  rows: number = Math.floor(this.height / w());

  ordered: Vector[] = [];

  ngAfterContentInit(): void {
    this.setup();
    setTimeout(() => this.paintLoop(), 1000);
  }

  setup() {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;

    this.ctx = canvas.getContext('2d');

    for (let i = 0; i < this.cols * this.rows; i++) {
      this.grid.push(undefined);
    }

    const vec = new Vector(this.width / 2, this.height / 2);
    this.active.push(vec);
    this.addToGrid(vec);
  }


  private addToGrid(vec: Vector) {
    const x = Math.floor(vec.x / w());
    const y = Math.floor(vec.y / w());
    this.grid[x + y * this.cols] = vec;
  }

  paintLoop(): void {
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const colorValue = Math.min(this.ordered.length * this.ordered.length, 255);
    this.grid.forEach((vec) => {
      if (vec) {
        this.ctx.fillStyle = `rgb(255, ${colorValue}, ${Math.floor(colorValue / 2)})`;
        drawVec(vec, this.ctx);
      }
    });

    this.ctx.fillStyle = 'red';
    this.active.forEach((vec) => {
      drawVec(vec, this.ctx);
    });

    if (this.active.length > 0) {
      const randActiveIndex = Math.floor(random(0, this.active.length));
      const pos = this.active[randActiveIndex];
      let found = false;

      for (let n = 0; n < k; n++) {
        const sample = Vector.randomVec().setMag(random(r, 2 * r)).add(pos);
        this.ctx.fillStyle = 'blue';
        drawVec(sample, this.ctx);

        const col = Math.floor(sample.x / w());
        const row = Math.floor(sample.y / w());
        const vectorFromGrid = this.grid[col + row * this.cols];

        if (col > -1 && row > -1 && col < this.cols && row < this.rows && vectorFromGrid == null) {
          let ok = true;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const index = (col + i) + (row + j) * this.cols;
              const neighbour = this.grid[index];
              if (neighbour) {
                this.ctx.strokeStyle = 'green';
                this.ctx.fillStyle = 'green';
                this.ctx.lineWidth = 10;
                this.ctx.beginPath();
                this.ctx.moveTo(sample.x, sample.y);

                this.ctx.stroke();
                this.ctx.lineTo(neighbour.x, neighbour.y);
                drawVec(neighbour, this.ctx);
                const d = sample.fastDist(neighbour);
                if (d < r * r) {
                  ok = false;
                }
              }
            }
          }
          if (ok) {
            found = true;
            this.addToGrid(sample);
            this.active.push(sample);
            this.ordered.push(sample);
          }
        }
      }
      if (!found) {
        this.active.splice(randActiveIndex, 1);
      }
    }
    requestAnimationFrame(() => this.paintLoop());
  }
}

function random(from: number, to: number): number {
  return Math.random() * (to - from) + from;
}

function drawVec(vec: Vector, ctx: CanvasRenderingContext2D) {
  drawPoint(vec.x, vec.y, ctx);
}

function drawPoint(x: number, y: number, canvas: CanvasRenderingContext2D) {
  canvas.beginPath();
  canvas.arc(x, y, r * 0.2, 0, 2 * Math.PI, true);
  canvas.fill();
}





