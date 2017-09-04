import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as p5 from 'p5';
import {CalcService} from '../calculation.service';

@Component({
  selector: 'app-p5-view',
  templateUrl: './p5-view.component.html',
  styleUrls: ['./p5-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class P5ViewComponent implements AfterContentInit, OnChanges {


  @ViewChild('drawArea') drawArea: ElementRef;
  @Input() width: number;
  @Input() height: number;
  @Input() calcService: CalcService;
  @Input() run = false;
  private scetch: any;
  @Output() afterFrameDrawn: EventEmitter<number> = new EventEmitter<number>();
  @Output() mousePressed: EventEmitter<{ x: number, y: number }> = new EventEmitter();
  private frameRate = 1.0;

  constructor() {
  }

  ngAfterContentInit() {
    this.scetch = new p5((p) => this.initP5(p), this.drawArea.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  private initP5(p: any) {
    p.setup = () => {
      p.createCanvas(this.width, this.height);
      p.pixelDensity(1);
    };

    p.draw = () => {
      p.background(51);
      const grid = this.getGrid();
      if (grid) {
        p.loadPixels();
        for (let x = 0; x < grid.length; x++) {
          const column = grid[x];
          for (let y = 0; y < column.length; y++) {
            const pix = (x + y * p.width) * 4;
            const a = column[y].a;
            const b = column[y].b;
            const r = p.constrain(p.floor((a - b) * 255), 0, 255);
            // const g = p.constrain(p.floor((b - a) * 255), 0, 255);
            p.pixels[pix + 0] = r;
            p.pixels[pix + 1] = r;
            p.pixels[pix + 2] = r;
            p.pixels[pix + 3] = 255;
          }
        }
        p.updatePixels();
      }

      const frameRate = p.frameRate();
      this.frameRate = this.frameRate * 0.95 + frameRate * 0.05;
      p.fill('green');
      p.text('fps: ' + p.floor(this.frameRate), 10, 10);
      if (this.run) {
        for (let i = 0; i < 1; i++) {
          this.calcService.calcNext(1.0);
          this.afterFrameDrawn.emit(1);
        }
      }
    };

    p.mouseDragged = () => {
      const x = p.floor(p.mouseX);
      const y = p.floor(p.mouseY);
      if (x > -1 && x < this.width && y > -1 && y < this.height) {
        // this.mousePressed.emit({x, y});
        this.calcService.addChemical(x, y);
      }
    };
  }

  private getGrid() {
    return this.calcService.grid;
  }
}

