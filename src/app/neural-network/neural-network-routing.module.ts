import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NeuralNetworkComponent} from './neural-network.component';
import {MultiPerceptronComponent} from './multi-perceptron/multi-perceptron.component';

const routes: Routes = [
  {path: '', component: NeuralNetworkComponent},
  {path: 'multiPerceptron', component: MultiPerceptronComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeuralNetworkRoutingModule { }
