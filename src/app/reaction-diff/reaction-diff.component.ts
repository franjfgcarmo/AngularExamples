import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalcService, CalcServiceFactory, Cell} from './calculation.service';

@Component({
  selector: 'app-reaction-diff',
  templateUrl: './reaction-diff.component.html',
  styleUrls: ['./reaction-diff.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionDiffComponent {
  public calcService: CalcService;
  public width = 200;
  public height = 200;
  public start = false;
  public diffRateA;
  public diffRateB;
  public feedRate;
  public killRate;
  public grid: Array<Cell[]>;

  constructor(calcFactory: CalcServiceFactory) {
    this.calcService = calcFactory.createCalcService(this.width, this.height);
    this.diffRateA = this.calcService.diffRateA;
    this.diffRateB = this.calcService.diffRateB;
    this.feedRate = this.calcService.feedRate;
    this.killRate = this.calcService.killRate;
    this.grid = this.calcService.grid;
  }

  public updateConfig(deltaTime: number) {
    if (this.start) {
      this.calcService.diffRateA = this.diffRateA;
      this.calcService.diffRateB = this.diffRateB;
      this.calcService.feedRate = this.feedRate;
      this.calcService.killRate = this.killRate;
    }
  }

  public toggleRunSim(): void {
    this.start = !this.start;
  }

  public reset() {
    this.start = false;
    this.calcService.reset();
  }

  public addChemical(event: { x: number, y: number }) {
    this.calcService.addChemical(event.x, event.y);
  }

}
