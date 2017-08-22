import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PoissonConfigService} from '../poisson-config.service';

@Component({
  selector: 'app-sim-controls',
  templateUrl: './sim-controls.component.html',
  styleUrls: ['./sim-controls.component.css'],
})
export class SimControlsComponent implements OnInit {

  play = false;

  @Output() playChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() onReset: EventEmitter<boolean> = new EventEmitter();
  _radius: number;
  _k: number;

  constructor(private poissonConfig: PoissonConfigService) {
    console.log(poissonConfig);
  }

  get radius() {
    return this.poissonConfig.r;
  }

  set radius(radius: number) {
    /*if (this.play && radius > this.poissonConfig.r) {
      this.poissonConfig.r = radius;
      return;
    }
    this.reset();*/
    this.poissonConfig.r = radius;
  }

  get k() {
    return this.poissonConfig.k;
  }

  set k(k: number) {
    this.poissonConfig.k = k;
  }

  get iterationsPerFrame() {
    return this.poissonConfig.iterationsPerFrame;
  }

  set iterationsPerFrame(iterationsPerFrame: number) {
    this.poissonConfig.iterationsPerFrame = iterationsPerFrame;
  }

  ngOnInit() {
    this._radius = this.poissonConfig.r;
  }

  private emitPlay() {
    this.playChanged.emit(this.play);
  }

  togglePlay() {
    this.play = !this.play;
    this.emitPlay();
  }

  reset(): void {
    this.play = false;
    this.emitPlay();
    this.onReset.emit(true);
  }

}
