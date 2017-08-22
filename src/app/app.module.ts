import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PoissonModule} from './poisson/poisson.module';
import { SimControlsComponent } from './poisson/sim-controls/sim-controls.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    PoissonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
