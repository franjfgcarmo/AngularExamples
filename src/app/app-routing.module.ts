import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {InfoComponent} from './info/info.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: InfoComponent},
  {path: 'poisson', loadChildren: 'app/poisson/poisson.module#PoissonModule'},
  {path: 'reactionDiff', loadChildren: 'app/reaction-diff/reaction-diff.module#ReactionDiffModule'},
  {path: '**', redirectTo: 'home'}
];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(routes);

