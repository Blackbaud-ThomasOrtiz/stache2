import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheFooterComponent } from './footer.component';

import { StacheLinkModule } from '../link';
import { StacheContainerModule } from '../container';

@NgModule({
  declarations: [
    StacheFooterComponent
  ],
  imports: [
    CommonModule,
    StacheLinkModule,
    StacheContainerModule
  ],
  exports: [
    StacheFooterComponent
  ]
})
export class StacheFooterModule { }
