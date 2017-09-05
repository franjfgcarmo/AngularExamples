import { NgModule } from '@angular/core';
import { ReactionDiffComponent } from './reaction-diff.component';
import {ReactionDiffCalcServiceFactory} from './reaction-diff-calculation.service';
import {reactionDiffRoutes} from './reaction-diff-routing.module';
import { P5ViewComponent } from './p5-view/p5-view.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    reactionDiffRoutes,
    SharedModule,
  ],
  declarations: [ReactionDiffComponent, P5ViewComponent],
  exports: [ReactionDiffComponent],
  providers: [ReactionDiffCalcServiceFactory]
})
export class ReactionDiffModule { }
