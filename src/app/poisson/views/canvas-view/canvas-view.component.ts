import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Circle} from '../../shared/circle';
import {CanvasDrawService} from './canvas-draw.service';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Scheduler} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Vector} from '../../shared/vector';


@Component({
  selector: 'app-canvas-view',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasViewComponent implements OnInit, AfterContentInit {


  @ViewChild('canvas') canvas: ElementRef;
  @Input() width: number;
  @Input() height: number;
  @Input() circles: Circle[];
  @Input() circleColors: string[];
  @Input() actives: Vector[];
  @Output() onReadyToPaint = new EventEmitter<number>();

  private draw$: Observable<number>;

  constructor(private canvasDrawService: CanvasDrawService) {
  }

  ngOnInit() {
    this.draw$ = new IntervalObservable(0, Scheduler.animationFrame).skipUntil(this.onReadyToPaint);
  }

  ngAfterContentInit(): void {
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    this.canvasDrawService.initCtx(context);
    setTimeout(() => this.onReadyToPaint.emit(0), 1000);
    this.draw$.subscribe(this.draw.bind(this));
  }

  private draw(step: number) {
    this.canvasDrawService.setFillColor('black');
    this.canvasDrawService.fillRect(0, 0, this.width, this.height);
    if (this.circles) {
      this.circles.forEach((circle) => this.canvasDrawService.drawCircle(circle, step));
    }
    if (this.actives) {
      this.canvasDrawService.setFillColor('red');
      this.actives.forEach((active) => this.canvasDrawService.drawVec(active, 1));
    }
    this.onReadyToPaint.emit(step);
  }
}
