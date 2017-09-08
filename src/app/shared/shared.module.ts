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
  MdSelectModule,
  MdSidenavModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {RaiseCardDirective} from './raise-card.directive';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/of';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdToolbarModule,
    MdTooltipModule,
    MdIconModule,
    MdCardModule,
    MdListModule,
    MdSelectModule,
    MdSidenavModule,
    RaiseCardDirective
  ],
  declarations: [RaiseCardDirective]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [RandomService],
    };
  }
}
