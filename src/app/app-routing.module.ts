import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

const routes: Routes = [
  {path: 'poisson', loadChildren: './poisson/poisson.module#PoissonModule'},
  {path: 'reactionDiff', loadChildren: './reaction-diff/reaction-diff.module#ReactionDiffModule'}
];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(routes);

