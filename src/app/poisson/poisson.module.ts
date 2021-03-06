import {NgModule} from '@angular/core';
import {PoissonComponent} from './poisson.component';
import {PoissonConfigService} from './poisson-config.service';
import {SharedModule} from '../shared/shared.module';
import {SharedModule as PoissonShared} from './shared/shared.module';
import {SimControlsComponent} from './sim-controls/sim-controls.component';
import {FormsModule} from '@angular/forms';
import {PoissonCalcService} from './poisson-calc.service';
import {P5ViewModule} from './views/p5-view/p5-view.module';
import {poissonRoutes} from './poisson-routing.module';

@NgModule({
  declarations: [
    PoissonComponent,
    SimControlsComponent],
  imports: [
    poissonRoutes,
    SharedModule,
    FormsModule,
    P5ViewModule,
    PoissonShared
  ],
  exports: [PoissonComponent],
  providers: [PoissonConfigService, PoissonCalcService],
})
export class PoissonModule {
}
