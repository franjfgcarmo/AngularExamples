import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RandomService} from './random.service';


@NgModule({
  providers: [RandomService],
  exports: [CommonModule],
})
export class SharedModule {
}
