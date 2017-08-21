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
import {PoisonConfigService} from './poison-config.service';
import {RandomService} from '../shared/random.service';
import {CanvasDrawHelperService} from '../shared/canvas-draw-helper.service';


@Component({
  selector: 'app-poison',
  templateUrl: './poison.component.html',
  styleUrls: ['./poison.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoisonComponent implements AfterContentInit {

  @ViewChild('canvas') canvas: ElementRef;
  @Input() play = true;

  grid: Vector[][] = [];
  active: Vector[] = [];
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  cols: number;
  rows: number;

  constructor(private poisonConfig: PoisonConfigService, private random: RandomService, private drawHelper: CanvasDrawHelperService) {
    this.width = 800;
    this.height = 600;
    this.rows = Math.floor(this.width / this.poisonConfig.w);
    this.cols = Math.floor(this.height / this.poisonConfig.w);
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

    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = undefined;
      }
    }
    const vec = new Vector(this.width / 2, this.height / 2);
    this.active.push(vec);
    this.addToGrid(vec);
  }

  private addToGrid(vec: Vector) {
    const x = Math.floor(vec.x / this.poisonConfig.w);
    const y = Math.floor(vec.y / this.poisonConfig.w);
    this.grid[x][y] = vec;
  }


  private getFromGrid(vec: Vector): Vector {
    const x = Math.floor(vec.x / this.poisonConfig.w);
    const y = Math.floor(vec.y / this.poisonConfig.w);
    return this.grid[x][y];
  }

  reset(): void {
    this.play = false;
    this.setup();
    this.play = true;
  }

  paintLoop(): void {
    if (this.play) {
      this.drawStep();
      for (let f = 0; f < Math.floor((this.rows * this.cols) / 100) && this.active.length > 0; f++) {
        const randActiveIndex = Math.floor(this.random.randomTo(this.active.length));
        const pos = this.active[randActiveIndex];
        const defaultRadius = this.poisonConfig.r * 0.2;
        const rQuad = this.poisonConfig.r * this.poisonConfig.r;
        let found = false;

        for (let n = 0; n < this.poisonConfig.k; n++) {
          const sample = Vector.randomVec().setMag(this.random.random(this.poisonConfig.r, 2 * this.poisonConfig.r)).add(pos);
          this.ctx.fillStyle = 'blue';
          this.drawHelper.drawVec(sample, defaultRadius, this.ctx);

          const row = Math.floor(sample.x / this.poisonConfig.w);
          const col = Math.floor(sample.y / this.poisonConfig.w);

          if (col > -1 && row > -1 && col < this.cols && row < this.rows && !this.getFromGrid(sample)) {
            let ok = true;
            this.ctx.fillStyle = 'yellow';
            this.drawHelper.drawVec(pos, defaultRadius, this.ctx);

            for (let i = -1; i <= 1; i++) {
              const neighbourRow = row + i;
              for (let j = -1; j <= 1 && neighbourRow > -1 && neighbourRow < this.rows; j++) {
                const neighbourCol = col + j;
                if (neighbourCol > -1 && neighbourCol < this.cols) {
                  const neighbour = this.grid[neighbourRow][neighbourCol];
                  this.ctx.strokeStyle = 'white';
                  if (neighbour) {
                    this.ctx.lineWidth = 1;
                    this.drawHelper.drawLine(sample, neighbour, this.ctx);
                    this.ctx.fillStyle = 'green';
                    this.drawHelper.drawVec(neighbour, defaultRadius, this.ctx);
                    const d = sample.fastDist(neighbour);

                    if (d < rQuad) {
                      ok = false;
                    }
                  }
                }
              }
            }
            if (ok) {
              found = true;
              this.addToGrid(sample);
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

  private drawStep() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const foundGridVecs = this.grid.reduce((flatted: Vector[], actual: Vector[]) => flatted.concat(actual.filter(vec => vec)), []);
    const colorValue = Math.min(foundGridVecs.length * foundGridVecs.length, 255);

    foundGridVecs
      .forEach((vec) => {
          this.ctx.fillStyle = `rgb(255, ${colorValue}, ${colorValue})`;
          this.drawHelper.drawVec(vec, this.poisonConfig.r * 0.2, this.ctx);
        }
      );

    this.ctx.fillStyle = 'red';
    this.active.forEach((vec) => {
      this.drawHelper.drawVec(vec, this.poisonConfig.r * 0.2, this.ctx);
    });
  }
}
