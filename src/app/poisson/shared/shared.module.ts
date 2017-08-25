import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShapeFactoryService} from './shape-factory.service';

@NgModule({
  providers: [ShapeFactoryService],
  declarations: []
})
export class SharedModule {
}
