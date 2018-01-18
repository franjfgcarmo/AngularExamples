import {NgModule} from '@angular/core';

import {NeuralNetworkRoutingModule} from './neural-network-routing.module';
import {SharedModule} from '../shared/shared.module';
import {NeuralNetworkComponent} from './neural-network.component';
import {BrainService} from './perceptron-tab/brain.service';
import {TrainDataService} from './shared/train-data.service';
import {PerceptronComponent} from './shared/perceptron/perceptron.component';
import {DataViewComponent} from './data-view/data-view.component';
import { MultiPerceptronComponent } from './multi-perceptron/multi-perceptron.component';
import { PerceptronTabComponent } from './perceptron-tab/perceptron-tab.component';

@NgModule({
  imports: [
    SharedModule,
    NeuralNetworkRoutingModule
  ],
  declarations: [NeuralNetworkComponent, PerceptronComponent, DataViewComponent, MultiPerceptronComponent, PerceptronTabComponent],
  providers: [BrainService, TrainDataService]
})
export class NeuralNetworkModule {

  constructor(){
  }
}
