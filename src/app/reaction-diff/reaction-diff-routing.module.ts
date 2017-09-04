import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReactionDiffComponent} from './reaction-diff.component';

const routes: Routes = [
  {path: '', component: ReactionDiffComponent},
];

export const reactionDiffRoutes: ModuleWithProviders = RouterModule.forChild(routes);

