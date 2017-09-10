import {
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
import {ColorMapperService} from './color-mapper.service';

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
  @Input() scale = 1;
  private scetch: any;
  @Output() mousePressed: EventEmitter<{ x: number, y: number }> = new EventEmitter();
  private frameRate = 1;

  constructor(private colorMapper: ColorMapperService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.simWidth || changes.simHeight || changes.scale) {
      if (this.scetch) {
        this.scetch.resizeCanvas(Math.floor(this.simWidth * this.scale), Math.floor(this.simHeight * this.scale));
      } else {
        this.scetch = new p5((p) => this.initP5(p), this.drawArea.nativeElement);
      }
    }
  }

  private initP5(p: any) {
    p.setup = () => {
      p.createCanvas(Math.floor(this.simWidth * this.scale), Math.floor(this.simHeight * this.scale));
      p.frameRate(10);
    };

    p.draw = () => {
      p.background(51);
      const grid = this.getGrid();
      if (grid) {

        const img = p.createImage(this.simWidth, this.simHeight);
        img.loadPixels();
        for (let x = 0; x < grid.length; x++) {
          const column = grid[x];
          for (let y = 0; y < column.length; y++) {
            const pix = (x + y * p.width) * 4;
            const cellColor = this.colorMapper.calcColorFor(column[y], p);
            img.pixels[pix] = cellColor.r;
            img.pixels[pix + 1] = cellColor.b;
            img.pixels[pix + 2] = cellColor.g;
            img.pixels[pix + 3] = 255;
          }
        }
        img.updatePixels();
        p.image(img, 0, 0);
        p.pop();
      }
      if (this.showFps) {
        const frameRate = p.frameRate();
        this.frameRate = this.frameRate * 0.8 + frameRate * 0.2;
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
    p.mouseOver = () => {

    };
  }

  private getGrid() {
    return this.calcService.grid;
  }
}

