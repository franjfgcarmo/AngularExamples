import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionDiffComponent } from './reaction-diff.component';
import {CalcServiceFactory} from './calculation.service';
import {reactionDiffRoutes} from './reaction-diff-routing.module';
import { P5ViewComponent } from './p5-view/p5-view.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    reactionDiffRoutes,
    FormsModule
  ],
  declarations: [ReactionDiffComponent, P5ViewComponent],
  providers: [CalcServiceFactory]
})
export class ReactionDiffModule { }
