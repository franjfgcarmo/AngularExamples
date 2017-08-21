import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasDrawHelperService} from './canvas-draw-helper.service';
import {RandomService} from './random.service';

@NgModule({
  providers: [CanvasDrawHelperService, RandomService],
  exports: [CommonModule],
  declarations: []
})
export class SharedModule {
}
