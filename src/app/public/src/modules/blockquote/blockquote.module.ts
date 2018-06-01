import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule } from '@angular/forms';

import { StacheBlockquoteComponent } from './blockquote.component';

@NgModule({
  declarations: [
    StacheBlockquoteComponent
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule
  ],
  exports: [
    StacheBlockquoteComponent
  ]
})
export class StacheBlockquoteModule { }
