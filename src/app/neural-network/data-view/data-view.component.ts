import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Perceptron} from '../shared/perceptron';
import {Point} from '../shared/point';
import {DataP5Scetch} from './data-p5-scetch';
import * as P5 from 'p5';

interface ChangeInputs extends SimpleChanges {
  points: SimpleChange;
  perceptron: SimpleChange;
}

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent implements OnInit, AfterViewInit, OnChanges {


  @ViewChild('dataCanvas') dataCanvas: ElementRef;
  @ViewChild('legendCanvas') legendCanvas: ElementRef;

  @Input() perceptron: Perceptron;
  @Input() points: Point[];
  @Input() canvasWidth? = 400;
  @Input() canvasHeight? = 400;
  @Output() dataViewClicked: EventEmitter<{ x: number, y: number, click: 'left' | 'right' }> = new EventEmitter();

  private dataScetch: any;

  constructor() {
  }

  ngOnChanges(changes: ChangeInputs): void {
    if (changes.points && !changes.points.firstChange && changes.points.previousValue !== changes.points.currentValue) {
      this.dataScetch.points = changes.points.currentValue;
    }
    if (changes.perceptron && !changes.perceptron.firstChange && changes.perceptron.previousValue !== changes.perceptron.currentValue) {
      this.dataScetch.perceptron = changes.perceptron.currentValue;
    }
  }

  ngAfterViewInit(): void {
    this.initDataScetch();
    this.initLegendScetch();
  }


  ngOnInit() {
  }

  private initDataScetch() {
    const dataScetch = new P5((p) => {
      this.dataScetch = new DataP5Scetch(p, this.canvasWidth, this.canvasHeight, (x, y, click) => {
        this.dataViewClicked.emit({x, y, click});
      });
      this.dataScetch.points = this.points;
      this.dataScetch.perceptron = this.perceptron;
    }, this.dataCanvas.nativeElement);
  }

  private initLegendScetch() {
    const legendScetch = new P5(
      (p) => {
        p.setup = () => {
          p.createCanvas(100, this.canvasHeight);
          p.background(255);
          p.fill(0);
          p.stroke(0);
          p.line(10, 50, 60, 50);
          p.noStroke();
          p.text('Class separation', 10, 42);

          p.stroke(255, 200, 200);
          p.strokeWeight(2);
          p.line(10, 100, 60, 100);
          p.noStroke();
          p.text('Perceptron separation', 10, 68, 20, 80);

          p.fill(255, 0, 0);
          p.noStroke();
          p.ellipse(15, 150, 5, 5);
          p.fill(0);
          p.text('Learned wrong', 10, 142);

          p.fill(0, 255, 0);
          p.noStroke();
          p.ellipse(15, 200, 5, 5);
          p.fill(0);
          p.text('Learned correct', 10, 192);


          p.fill(255, 255, 0);
          p.stroke(0);
          p.ellipse(15, 250, 8, 8);
          p.fill(0);
          p.noStroke();
          p.text('Class 1', 10, 242);

          p.fill(0, 0, 255);
          p.stroke(0);
          p.ellipse(15, 300, 8, 8);
          p.fill(0);
          p.noStroke();
          p.text('Class 2', 10, 292);

        };

      }, this.legendCanvas.nativeElement);
  }
}
