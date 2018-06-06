import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheContainerComponent } from './container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StacheContainerComponent
  ],
  exports: [
    StacheContainerComponent
  ],
  providers: []
})
export class StacheContainerModule { }
