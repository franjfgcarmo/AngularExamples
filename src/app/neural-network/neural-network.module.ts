import {NgModule} from '@angular/core';

import {NeuralNetworkRoutingModule} from './neural-network-routing.module';
import {SharedModule} from '../shared/shared.module';
import {NeuralNetworkComponent} from './neural-network.component';

@NgModule({
  imports: [
    SharedModule,
    NeuralNetworkRoutingModule
  ],
  declarations: [NeuralNetworkComponent]
})
export class NeuralNetworkModule { }
