import {AfterContentInit, AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as GPU from 'gpu.js/dist';
import {combineLatest, startWith, timeout} from 'rxjs/operators';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {animationFrame} from 'rxjs/scheduler/animationFrame';

@Component({
  selector: 'app-some-gpu-calculation',
  templateUrl: './some-gpu-calculation.component.html',
  styleUrls: ['./some-gpu-calculation.component.less']
})
export class SomeGpuCalculationComponent implements AfterViewInit {

  @ViewChild('gpuResult') gpuResult: ElementRef;

  addResult = undefined;
  private additionForm: FormGroup;
  private gpu: any;

  private gpuColorizer: any;

  constructor(private fb: FormBuilder) {
    this.gpu = new GPU();
    this.createGPUColorizer();
    this.createForm();
  }

  private createForm() {
    this.additionForm = this.fb.group({
      r: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      g: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      b: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      sinDivider: [100, [Validators.required, Validators.min(1), Validators.max(200)]]
    });
  }

  ngAfterViewInit(): void {
    new IntervalObservable(0, animationFrame).pipe(
      combineLatest(
        this.additionForm.get('r').valueChanges.pipe(startWith(255)),
        this.additionForm.get('g').valueChanges.pipe(startWith(255)),
        this.additionForm.get('b').valueChanges.pipe(startWith(255)),
        this.additionForm.get('sinDivider').valueChanges.pipe(startWith(100))),
    ).subscribe(([frame, r, g, b, sinDivider]) => {
      console.log(frame, r, g, b, sinDivider);
      return this.createCanvasWithGPU(frame, r, g, b, sinDivider);
    });
  }

  submitForm() {
    // todo
  }

  private createGPUColorizer() {
    this.gpuColorizer = this.gpu.createKernel(function (frame, r, g, b, sinDiv) {
      this.color(r * Math.sin(frame * 0.7 + this.thread.x / sinDiv), g * Math.sin(frame * 0.2 + this.thread.y / sinDiv), b * Math.sin(frame * 0.3 + (this.thread.y + this.thread.x) / (sinDiv * sinDiv)), 1);
    })
      .setGraphical(true);
  }

  createCanvasWithGPU(frame: number, r: number, g: number, b: number, sinDivider: number) {
    const width = this.gpuResult.nativeElement.clientWidth;
    this.gpuColorizer.setOutput([width, Math.floor(width / 4)]);
    this.gpuColorizer(frame, r / 255, g / 255, b / 255, sinDivider);
    const canvas = this.gpuColorizer.getCanvas();
    this.gpuResult.nativeElement.appendChild(canvas);
  }
}
