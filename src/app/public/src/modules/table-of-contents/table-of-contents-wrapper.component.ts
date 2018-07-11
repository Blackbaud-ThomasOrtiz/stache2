import { Component, Input, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SkyMediaQueryService, SkyMediaBreakpoints } from '@blackbaud/skyux/dist/core';

import { StacheNavLink } from '../nav';
import { StacheWindowRef } from '../shared';

const HAS_TABLE_OF_CONTENTS_CLASS_NAME: string  = 'stache-table-of-contents-enabled';
let nextUniqueId = 0;

@Component({
  selector: 'stache-table-of-contents-wrapper',
  templateUrl: './table-of-contents-wrapper.component.html',
  styleUrls: ['./table-of-contents-wrapper.component.scss']
})
export class StacheTableOfContentsWrapperComponent implements  OnDestroy, AfterViewInit {
  @Input()
  public tocRoutes: StacheNavLink[];

  public tocOpen: boolean = false;

  public tocLabel: string = 'Click to open sidebar';

  public elementId = `stache-table-of-contents-content-panel-${(nextUniqueId++)}`;

  private mediaQuerySubscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private windowRef: StacheWindowRef,
    private mediaQueryService: SkyMediaQueryService
  ) {

    this.mediaQuerySubscription = this.mediaQueryService
     .subscribe((args: SkyMediaBreakpoints) => {
       this.tocOpen = (args <= SkyMediaBreakpoints.md);
       this.toggleToc();
     });
  }

  public ngAfterViewInit(): void {
    this.addClassToBody();
  }

  public toggleToc(): void {
    this.tocOpen = !this.tocOpen;
  }

  public ngOnDestroy(): void {
    this.removeClassFromBody();
    this.mediaQuerySubscription.unsubscribe();
  }

  private addClassToBody(): void {
    this.renderer.addClass(
      this.windowRef.nativeWindow.document.body,
      HAS_TABLE_OF_CONTENTS_CLASS_NAME
    );
  }

  private removeClassFromBody(): void {
    this.renderer.removeClass(
      this.windowRef.nativeWindow.document.body,
      HAS_TABLE_OF_CONTENTS_CLASS_NAME
    );
  }
}
