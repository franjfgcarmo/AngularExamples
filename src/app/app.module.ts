import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PoissonModule} from './poisson/poisson.module';
import { SimControlsComponent } from './sim-controls/sim-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    SimControlsComponent,
  ],
  imports: [
    BrowserModule,
    PoissonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
