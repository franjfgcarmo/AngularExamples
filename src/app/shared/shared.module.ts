import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasDrawHelperService} from './canvas-draw-helper.service';
import {RandomService} from './random.service';
import {DrawHelper} from './draw-helper';
import {CanvasDrawHelperServiceWebGl} from './canvas-draw-helper-webgl.service';

export const DRAW_HELPER = new InjectionToken<DrawHelper>('draw.helper');

@NgModule({
  providers: [
    {provide: DRAW_HELPER, useClass: CanvasDrawHelperServiceWebGl},
    RandomService],
  exports: [CommonModule],
  declarations: []
})
export class SharedModule {
}
