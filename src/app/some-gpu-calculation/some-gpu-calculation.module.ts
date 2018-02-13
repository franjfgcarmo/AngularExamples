import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {someGpuCalculationRoutes} from './some-gpu-calculation-routing.module';
import {SomeGpuCalculationComponent} from './some-gpu-calculation.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    someGpuCalculationRoutes,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [SomeGpuCalculationComponent],
  providers: []
})
export class SomeGpuCalculationModule { }
