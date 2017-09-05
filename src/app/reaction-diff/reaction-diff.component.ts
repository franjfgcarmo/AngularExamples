import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
  ReactionDiffCalcService, ReactionDiffCalcServiceFactory, Cell,
  CellWeights
} from './reaction-diff-calculation.service';

@Component({
  selector: 'app-reaction-diff',
  templateUrl: './reaction-diff.component.html',
  styleUrls: ['./reaction-diff.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionDiffComponent {
  public calcService: ReactionDiffCalcService;
  public start = false;
  public showFps = true;
  public width = 200;
  public height = 200;
  public diffRateA;
  public diffRateB;
  public feedRate;
  public killRate;
  public weights: CellWeights;

  constructor(private calcFactory: ReactionDiffCalcServiceFactory) {
    this.calcService = calcFactory.createCalcService(this.width, this.height);
    this.getConfig();
  }

  public getConfig() {
    this.diffRateA = this.calcService.diffRateA;
    this.diffRateB = this.calcService.diffRateB;
    this.feedRate = this.calcService.feedRate;
    this.killRate = this.calcService.killRate;
    this.weights = this.calcService.weights;
  }

  public updateCalcServiceConfig() {
    this.calcService.diffRateA = this.diffRateA;
    this.calcService.diffRateB = this.diffRateB;
    this.calcService.feedRate = this.feedRate;
    this.calcService.killRate = this.killRate;
    this.calcService.weights = this.weights;
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

  public resetParametersWeights() {
    this.calcService.resetParamsAndWeights();
    this.getConfig();
  }

  public updateDimension() {
    this.calcService = this.calcFactory.createCalcService(this.width, this.height);
  }

}
