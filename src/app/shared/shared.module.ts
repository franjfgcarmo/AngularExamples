import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RandomService} from './random.service';
import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdSelectModule,
  MdToolbarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import 'rxjs/add/operator/map';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdToolbarModule,
    MdIconModule,
    MdMenuModule,
    MdCardModule,
    MdListModule,
    MdSelectModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [RandomService],
    };
  }
}
