import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {appRoutes} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InfoComponent} from './info/info.component';
import {TechnologyComponent} from './info/technology/technology.component';
import {NavItemComponent} from './nav-item/nav-item.component';
import {CoreModule} from './core/core.module';
import { SomeGpuCalculationComponent } from './some-gpu-calculation/some-gpu-calculation.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    TechnologyComponent,
    NavItemComponent,
  ],
  imports: [
    CoreModule.forRoot(),
    BrowserModule,
    appRoutes,
    BrowserAnimationsModule,
    SharedModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
