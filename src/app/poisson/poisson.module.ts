import {NgModule} from '@angular/core';
import {PoissonComponent} from './poisson.component';
import {PoissonConfigService} from './poisson-config.service';
import {SharedModule} from '../shared/shared.module';
import {SimControlsComponent} from './sim-controls/sim-controls.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    PoissonComponent,
    SimControlsComponent,
  ],
  imports: [
    SharedModule,
    FormsModule
  ],
  exports: [PoissonComponent],
  providers: [PoissonConfigService]
})
export class PoissonModule {
}
