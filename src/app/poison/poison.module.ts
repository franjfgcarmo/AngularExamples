import {NgModule} from '@angular/core';
import {PoisonComponent} from './poison.component';
import {PoisonConfigService} from './poison-config.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    PoisonComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [PoisonComponent],
  providers: [PoisonConfigService]
})
export class PoisonModule {
}
