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
  @Output() dataViewClicked: EventEmitter<{ x: number, y: number }> = new EventEmitter<{ x: number, y: number }>();

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
    const dataScetch = new P5((p) => {
      this.dataScetch = new DataP5Scetch(p, this.canvasWidth, this.canvasHeight, (x, y) => {
        console.log('clicked', x, y);
        this.dataViewClicked.emit({x, y});
      });
      this.dataScetch.points = this.points;
      this.dataScetch.perceptron = this.perceptron;
    }, this.dataCanvas.nativeElement);
  }


  ngOnInit() {

  }
}
