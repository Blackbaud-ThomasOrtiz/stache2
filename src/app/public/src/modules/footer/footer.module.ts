import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheFooterComponent } from './footer.component';

import { StacheNavModule } from '../nav';

@NgModule({
  declarations: [
    StacheFooterComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule
  ],
  exports: [
    StacheFooterComponent
  ]
})
export class StacheFooterModule { }
