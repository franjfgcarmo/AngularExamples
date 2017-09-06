import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {CalcCellWeights} from './cell-weights';
import {Observable} from 'rxjs/Observable';
import {ReactionDiffCalcParams} from './reaction-diff-calc-params';

@Injectable()
export class ReactionDiffConfigService {

  static defaultParams: ReactionDiffCalcParams = {
    diffRateA: 1.0,
    diffRateB: 0.5,
    feedRate: 0.0367,
    killRate: 0.0649,
  };

  static defaultWeights = {
    topLeft: 0.05, topCenter: 0.2, topRight: 0.05,
    left: 0.2, center: -1.0, right: 0.2,
    bottomLeft: 0.05, bottomCenter: 0.2, bottomRight: 0.05
  };

  private paramsSubject$: Subject<ReactionDiffCalcParams> = new BehaviorSubject(ReactionDiffConfigService.defaultParams);
  private weightsSubject$: Subject<CalcCellWeights> = new BehaviorSubject(ReactionDiffConfigService.defaultWeights);

  public calcParams$: Observable<ReactionDiffCalcParams>;
  public calcCellWeights$: Observable<CalcCellWeights>;

  constructor() {
    this.calcParams$ = this.paramsSubject$.asObservable()
      .map((calcParams) => Object.assign({}, calcParams));
    this.calcCellWeights$ = this.weightsSubject$.asObservable()
      .map((calcWeights) => Object.assign({}, calcWeights));
  }

  updateCalcParams(calcParams: ReactionDiffCalcParams) {
    this.paramsSubject$.next(calcParams);
  }

  updateCalcCellWeights(weightsParams: CalcCellWeights) {
    this.weightsSubject$.next(weightsParams);
  }

  resetCalcParams() {
    this.updateCalcParams(ReactionDiffConfigService.defaultParams);
  }

  resetCalcCellWeights() {
    this.updateCalcCellWeights(ReactionDiffConfigService.defaultWeights);
  }


}
