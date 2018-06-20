import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheFooterComponent } from './footer.component';

import { StacheNavModule } from '../nav';
import { StacheContainerModule } from '../container';

@NgModule({
  declarations: [
    StacheFooterComponent
  ],
  imports: [
    CommonModule,
    StacheContainerModule,
    StacheNavModule
  ],
  exports: [
    StacheFooterComponent
  ]
})
export class StacheFooterModule { }
