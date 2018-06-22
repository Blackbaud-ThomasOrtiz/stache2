import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav';
import { StacheSidebarComponent } from './sidebar.component';
import { StacheSidebarWrapperComponent } from './sidebar-wrapper.component';
import { StacheLinkModule } from '../link';
import { StacheAffixWithinLayoutDirective } from './affix-within-layout.directive';

@NgModule({
  declarations: [
    StacheSidebarComponent,
    StacheSidebarWrapperComponent,
    StacheAffixWithinLayoutDirective
  ],
  imports: [
    CommonModule,
    StacheNavModule,
    StacheLinkModule
  ],
  exports: [
    StacheSidebarComponent,
    StacheSidebarWrapperComponent,
    StacheAffixWithinLayoutDirective
  ]
})
export class StacheSidebarModule { }
