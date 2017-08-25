import {AfterContentInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Vector} from './shared/vector';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {PoissonCalcService} from './poisson-calc.service';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'app-poisson',
  templateUrl: './poisson.component.html',
  styleUrls: ['./poisson.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoissonComponent implements OnInit {

  width = 600;
  height = 600;

  play = false;

  constructor(public poissonCalc: PoissonCalcService) {
  }

  ngOnInit(): void {
    this.setup();
  }

  setup() {
    this.poissonCalc.setup(this.width, this.height);
  }

  reset(): void {
    this.setup();
  }

  calculate(): void {
    if (this.play) {
      this.poissonCalc.calculate();
    }
  }

  addPoint(vector: Vector) {
    this.poissonCalc.addPointForCalculation(vector);
  }

  setPlay(play: boolean) {
    this.play = play;
  }
}
