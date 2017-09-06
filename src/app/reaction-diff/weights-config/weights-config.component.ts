import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CalcCellWeights} from '../cell-weights';

@Component({
  selector: 'app-weights-config',
  templateUrl: './weights-config.component.html',
  styleUrls: ['./weights-config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightsConfigComponent {
  @Input() weights: CalcCellWeights;
  @Output() onWeightsChanged: EventEmitter<CalcCellWeights> = new EventEmitter<CalcCellWeights>();

  constructor() {
  }

  onWeightChanged() {
    this.onWeightsChanged.emit(this.weights);
  }
}
