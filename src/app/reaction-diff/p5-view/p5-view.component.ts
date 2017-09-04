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
import {CalcService, CalcServiceFactory, Cell} from '../calculation.service';

@Component({
  selector: 'app-p5-view',
  templateUrl: './p5-view.component.html',
  styleUrls: ['./p5-view.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class P5ViewComponent implements AfterContentInit, OnChanges {


  @ViewChild('drawArea') drawArea: ElementRef;
  @Input() width: number;
  @Input() height: number;
  @Input() calcService: CalcService;
  @Input() run = false;
  private scetch: any;
  @Output() calcNextValue: EventEmitter<number> = new EventEmitter<number>();
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
      if (this.getGrid()) {
        p.loadPixels();
        for (let x = 0; x < this.getGrid().length; x++) {
          const column = this.getGrid()[x];
          for (let y = 0; y < column.length; y++) {
            const pix = (x + y * p.width) * 4;
            const a = column[y].a;
            const b = column[y].b;
            let c = p.floor((a - b) * 255);
            c = p.constrain(c, 0, 255);
            p.pixels[pix + 0] = c;
            p.pixels[pix + 1] = c;
            p.pixels[pix + 2] = c;
            p.pixels[pix + 3] = 255;
          }
        }
        p.updatePixels();
      }

      this.frameRate = this.frameRate * 0.95 + p.frameRate() * 0.05;
      p.fill('white');
      p.text('fps: ' + this.frameRate, 10, 10);
      if (this.run) {
        this.calcService.calcNext(1);
        this.calcNextValue.emit(1);
      }
    };

    p.mouseClicked = () => {
      const x = p.floor(p.mouseX);
      const y = p.floor(p.mouseY);
      if (x > -1 && x < this.width && y > -1 && y < this.height) {
        // this.mousePressed.emit({x, y});
        this.calcService.addChemical(x, y);
      }
    };
  }

  private getGrid() {
    return this.calcService.next;
  }
}

