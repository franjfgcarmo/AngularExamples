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
import {ReactionDiffCalcService} from '../reaction-diff-calculation.service';

@Component({
  selector: 'app-p5-view',
  templateUrl: './p5-view.component.html',
  styleUrls: ['./p5-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class P5ViewComponent implements OnChanges {


  @ViewChild('drawArea') drawArea: ElementRef;
  @Input() simWidth: number;
  @Input() simHeight: number;
  @Input() calcService: ReactionDiffCalcService;
  @Input() run = false;
  @Input() showFps = false;
  private scetch: any;
  @Output() mousePressed: EventEmitter<{ x: number, y: number }> = new EventEmitter();
  private frameRate = 60;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.calcService) {
      if (this.scetch) {
        this.scetch.remove();
      }
      this.scetch = new p5((p) => this.initP5(p), this.drawArea.nativeElement);
    }
  }

  private initP5(p: any) {
    p.setup = () => {
      p.createCanvas(this.simWidth, this.simHeight);
      p.pixelDensity(1);
      p.frameRate(this.frameRate);
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
            // const blue = p.constrain(p.floor((a * b) * 255), 0, 255);
            p.pixels[pix + 0] = r;
            p.pixels[pix + 1] = r;
            p.pixels[pix + 2] = r;
            p.pixels[pix + 3] = 255;
          }
        }
        p.updatePixels();
      }
      if (this.showFps) {
        const frameRate = p.frameRate();
        this.frameRate = this.frameRate * 0.95 + frameRate * 0.05;
        p.fill('green');
        p.text('fps: ' + p.floor(this.frameRate), 10, 10);
      }
      if (this.run) {
        for (let i = 0; i < 1; i++) {
          this.calcService.calcNext();
        }
      }
    };

    p.mouseDragged = () => {
      const x = p.floor(p.mouseX);
      const y = p.floor(p.mouseY);
      if (x > -1 && x < p.width && y > -1 && y < p.height) {
        // this.mousePressed.emit({x, y});
        this.calcService.addChemical(x, y);
      }
    };
    p.mouseClicked = () => {
      const x = p.floor(p.mouseX);
      const y = p.floor(p.mouseY);
      if (x > -1 && x < p.width && y > -1 && y < p.height) {
        // this.mousePressed.emit({x, y});
        this.calcService.addChemical(x, y);
      }
    };
  }

  private getGrid() {
    return this.calcService.grid;
  }
}

