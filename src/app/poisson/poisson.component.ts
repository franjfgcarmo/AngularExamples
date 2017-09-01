import {AfterContentInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Vector} from './shared/vector';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {PoissonCalcServiceService} from './poisson-calc-service.service';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'app-poisson',
  templateUrl: './poisson.component.html',
  styleUrls: ['./poisson.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoissonComponent implements AfterContentInit, OnInit, OnDestroy {

  width = 600;
  height = 600;

  play = false;

  private subscriptions: Subscription;

  constructor(public poissonCalc: PoissonCalcServiceService) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.setup();
    }, 0);
  }

  setup() {
    /*this.drawHelper.setFillColor('black');
    this.drawHelper.fillRect(0, 0, this.width, this.height);*/
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

  addPoint($event: MouseEvent) {
    const vector = new Vector($event.offsetX, $event.offsetY);
    this.poissonCalc.addPointForCalculation(vector);
  }

  setPlay(play: boolean) {
    this.play = play;
  }
}
