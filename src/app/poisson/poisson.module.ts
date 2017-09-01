import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AFrameViewComponent} from './views/a-frame-view/a-frame-view.component';
import {PoissonComponent} from './poisson.component';
import {PoissonConfigService} from './poisson-config.service';
import {SharedModule} from '../shared/shared.module';
import {SharedModule as PoissonShared} from './shared/shared.module';
import {SimControlsComponent} from './sim-controls/sim-controls.component';
import {FormsModule} from '@angular/forms';
import {PoissonCalcService} from './poisson-calc.service';
import {CanvasViewModule} from './views/canvas-view/canvas-view.module';
import {P5ViewModule} from './views/p5-view/p5-view.module';

@NgModule({
  declarations: [
    PoissonComponent,
    SimControlsComponent,
    AFrameViewComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    CanvasViewModule,
    P5ViewModule,
    PoissonShared
  ],
  exports: [PoissonComponent],
  providers: [PoissonConfigService, PoissonCalcService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PoissonModule {
  constructor() {
    /*AFRAME.registerComponent('changing-color', {
      tick: function (time, timeDelta) {

        function toHex(val: number): string {
          const result = Math.floor(val % 255).toString(16);
          return result.length > 1 ? result : '0' + result;
        }

        function toRGBtoHex({r, g, b}: { r: number, g: number, b: number }) {
          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }

        function hueToRgb(t1, t2, hue) {
          if (hue < 0) {
            hue += 6;
          }
          if (hue >= 6) {
            hue -= 6;
          }
          if (hue < 1) {
            return (t2 - t1) * hue + t1;
          }
          if (hue < 3) {
            return t2;
          }
          if (hue < 4) {
            return (t2 - t1) * (4 - hue) + t1;
          }
          return t1;
        }

        function hslToRgb(hue, sat, light) {
          let t1, t2, r, g, b;
          hue = hue / 60;
          if (light <= 0.5) {
            t2 = light * (sat + 1);
          } else {
            t2 = light + sat - (light * sat);
          }
          t1 = light * 2 - t2;
          r = hueToRgb(t1, t2, hue + 2) * 255;
          g = hueToRgb(t1, t2, hue) * 255;
          b = hueToRgb(t1, t2, hue - 2) * 255;
          return {r: r, g: g, b: b};
        }

        const position = this.el.object3D.position;
        const hue = 360 * Math.abs(Math.sin((time + position.x) * 0.001));
        const sat = Math.abs(Math.cos(this.el.getAttribute('radius')));
        const rgb = hslToRgb(hue, sat, 0.5);
        const color = toRGBtoHex(rgb);
        this.el.setAttribute('color', color);
      },


    });*/
  }
}
