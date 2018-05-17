import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheFooterComponent } from './footer.component';
import { StacheLinkModule } from '../link';

@NgModule({
  declarations: [
    StacheFooterComponent
  ],
  imports: [
    CommonModule,
    StacheLinkModule
  ],
  exports: [
    StacheFooterComponent
  ]
})
export class StacheFooterModule { }
