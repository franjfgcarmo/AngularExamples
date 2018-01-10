import {Route, RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {InfoComponent} from './info/info.component';

interface AppRoute extends Route {
  linkText?: string;
}

export const routes: AppRoute[] = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: InfoComponent, linkText: 'Home'},
  {
    path: 'poisson',
    loadChildren: 'app/poisson/poisson.module#PoissonModule',
    linkText: 'Poisson Distribution Algorithm'
  },
  {
    path: 'reactionDiff',
    loadChildren: 'app/reaction-diff/reaction-diff.module#ReactionDiffModule',
    linkText: 'Reaction Diffusion Algorithm'
  },
  {path: 'webGl', loadChildren: 'app/web-gl/web-gl.module#WebGlModule', linkText: 'WebGl Examples'},
  {
    path: 'neuralNetwork',
    loadChildren: 'app/neural-network/neural-network.module#NeuralNetworkModule',
    linkText: 'Neural Networks'
  },
  {path: '**', redirectTo: 'home'}
];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(routes);

