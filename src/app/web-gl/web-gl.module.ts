import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {webGlRoutes} from './web-gl-routing.module';
import {WebGlComponent} from './web-gl.component';

@NgModule({
  imports: [
    CommonModule,
    webGlRoutes
  ],
  declarations: [WebGlComponent]
})
export class WebGlModule { }
