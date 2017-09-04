import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingComponent} from './app-routing.component';

const routes: Routes = [
  {path: '', component: AppRoutingComponent},
  {path: 'poisson', loadChildren: '../poisson/poisson.module#PoissonModule'},
  {path: 'reactionDiff', loadChildren: '../reaction-diff/reaction-diff.module#ReactionDiffModule'}
];

@NgModule({
  declarations: [AppRoutingComponent],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule, AppRoutingComponent]
})
export class AppRoutingModule {
}
