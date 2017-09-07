import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {
  ReactionDiffCalcService,
  ReactionDiffCalcServiceFactory
} from './reaction-diff-calculation.service';
import 'rxjs/add/operator/do';
import {CalcCellWeights} from './cell-weights';
import {ReactionDiffConfigService} from './reaction-diff-config.service';
import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {Observable} from 'rxjs/Observable';
import {MdSelectChange} from '@angular/material';


@Component({
  selector: 'app-reaction-diff',
  templateUrl: './reaction-diff.component.html',
  styleUrls: ['./reaction-diff.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionDiffComponent implements OnInit {

  public calcService: ReactionDiffCalcService;
  public start = false;
  public showFps = true;
  public width = 200;
  public height = 200;
  public cellWeights$: Observable<CalcCellWeights>;
  public calcParams: ReactionDiffCalcParams;
  public examples: string[];
  public selectedExample: string;
  public addChemicalRadius: number;

  constructor(private calcFactory: ReactionDiffCalcServiceFactory, private configService: ReactionDiffConfigService) {
  }

  public ngOnInit(): void {
    this.examples = this.configService.exampleOptions;

    this.calcService = this.calcFactory.createCalcService(this.width, this.height);
    this.cellWeights$ = this.configService.calcCellWeights$;
    this.configService.selectedExample$.subscribe((example) =>
      this.selectedExample = example
    );
    this.configService.calcParams$.subscribe((calcParams) =>
      this.calcParams = calcParams
    );
    this.configService.addChemicalRadius$.subscribe((radius) =>
      this.addChemicalRadius = radius
    );
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
    this.configService.resetCalcParams();
    this.configService.resetCalcCellWeights();
  }

  public updateDimension() {
    this.calcService.resize(this.width, this.height);
  }

  public updateCalcParams(calcParams: ReactionDiffCalcParams) {
    this.configService.updateCalcParams(calcParams);
  }

  public updateWeights(weights: CalcCellWeights) {
    this.configService.updateCalcCellWeights(weights);
  }

  public setSelection(option: MdSelectChange) {
    this.configService.setSelection(option.value);
  }

  public updateAddChemicalRadius() {
    console.log(this.addChemicalRadius);
    this.configService.updateAddChemicalRadius(this.addChemicalRadius);
  }
}
