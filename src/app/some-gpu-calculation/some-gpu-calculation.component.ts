import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as GPU from 'gpu.js/dist';
import {input} from 'gpu.js/dist';
import {combineLatest, map, startWith, mergeMap, timeInterval, scan} from 'rxjs/operators';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {animationFrame} from 'rxjs/scheduler/animationFrame';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import {of} from 'rxjs/observable/of';
import {TimeInterval} from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-some-gpu-calculation',
  templateUrl: './some-gpu-calculation.component.html',
  styleUrls: ['./some-gpu-calculation.component.less']
})
export class SomeGpuCalculationComponent implements AfterViewInit, OnDestroy {


  @ViewChild('gpuResult') gpuResult: ElementRef;

  additionForm: FormGroup;
  calculationTime$: Observable<number>;

  private gpu: GPU;
  private gpuColorizer: KernelFunction;
  private subscription: Subscription;

  constructor(private fb: FormBuilder) {
    this.gpu = new GPU();
    this.createGPUColorizer();
    this.createForm();
    this.calculationTime$ = interval(1000).pipe(
      mergeMap(ignored => of(performance.getEntriesByName('createCanvasWithGPU'))),
      map((measures: PerformanceMeasure[]) => {
        if (measures.length === 0) {
          return 0;
        }
        return measures.reduce((acc, next) => acc + next.duration / measures.length, 0);
      })
    );
  }

  private createForm() {
    this.additionForm = this.fb.group({
      r: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      g: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      b: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      sinDivider: [100, [Validators.required, Validators.min(1), Validators.max(200)]],
      speed: [20, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngAfterViewInit(): void {
    this.subscription = IntervalObservable.create(Math.floor(1000 / 30), animationFrame).pipe(
      timeInterval<number>(),
      scan<TimeInterval<number>, number>((acc, value) => acc + value.interval, 0),
      combineLatest(
        this.additionForm.get('r').valueChanges.pipe(startWith(255)),
        this.additionForm.get('g').valueChanges.pipe(startWith(255)),
        this.additionForm.get('b').valueChanges.pipe(startWith(255)),
        this.additionForm.get('sinDivider').valueChanges.pipe(startWith(100)),
        this.additionForm.get('speed').valueChanges.pipe(startWith(20), map((speed) => speed / 100)))
    ).subscribe(([frameTime, r, g, b, sinDivider, speed]) =>
      this.createCanvasWithGPU(frameTime, r, g, b, sinDivider, speed));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private createGPUColorizer() {

    this.gpuColorizer = this.gpu.createKernel(function (frameTime, r, g, b, sinDiv, speed) {

      const framedSpeed = frameTime * speed;
      const x = this.thread.x;
      const y = this.thread.y;
      const waveParam0 = (framedSpeed + x + 0.5 * y) / sinDiv;
      const waveParam1 = (framedSpeed + y) / sinDiv;
      const waveParam2 = (framedSpeed + y + x) / sinDiv;

      this.color(
        r * Math.sin(waveParam0),
        g * Math.cos(waveParam1),
        b * Math.tan(waveParam2),
        1
      );
    }).setGraphical(true);
  }

  createCanvasWithGPU(frameTime: number, r: number, g: number, b: number, sinDivider: number, speed: number) {
    performance.mark('createCanvasWithGPU-start');
    const canvas: HTMLCanvasElement = this.gpuResult.nativeElement;
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.gpuColorizer.setOutput([width, height]);
    this.gpuColorizer(
      frameTime,
      r / 255,
      g / 255,
      b / 255,
      sinDivider,
      speed);

    const gpuCanvas: HTMLCanvasElement = this.gpuColorizer.getCanvas();
    ctx.drawImage(gpuCanvas, 0, 0);
    performance.mark('createCanvasWithGPU-end');
    performance.measure('createCanvasWithGPU', 'createCanvasWithGPU-start', 'createCanvasWithGPU-end');
  }
}
