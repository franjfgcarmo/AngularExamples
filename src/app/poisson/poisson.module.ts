import {NgModule} from '@angular/core';
import {PoissonComponent} from './poisson.component';
import {PoissonConfigService} from './poisson-config.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    PoissonComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [PoissonComponent],
  providers: [PoissonConfigService]
})
export class PoissonModule {
}
