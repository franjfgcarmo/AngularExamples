import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PoisonModule} from './poison/poison.module';
import { SimControlsComponent } from './sim-controls/sim-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    SimControlsComponent,
  ],
  imports: [
    BrowserModule,
    PoisonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
