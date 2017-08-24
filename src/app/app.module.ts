import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PoissonModule} from './poisson/poisson.module';

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
