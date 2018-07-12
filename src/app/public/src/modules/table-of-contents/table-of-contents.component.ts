import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener, HostBinding } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { StacheWindowRef } from '../shared';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheTableOfContentsComponent implements StacheNav, AfterViewInit {
  @Input()
  public routes: StacheNavLink[] = [];
  @HostBinding('class.active')
  public active: boolean = false;

  private documentElement: any;
  private pageOffset: number;
  private pageHeight: number;
  private document: Document;
  private window: Window;
  private activeRoute: StacheNavLink;
  private anchors: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private windowRef: StacheWindowRef
  ) {
    this.window = this.windowRef.nativeWindow;
    this.document = this.window.document;
    this.documentElement = document.documentElement;
    this.pageHeight = this.documentElement.offsetHeight;
  }

  public ngAfterViewInit() {
    this.cdr.markForCheck();
    setTimeout(this.updateActiveRoute(), 0);
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll(event: Event) {
    this.trackPageOffset();
    this.updateActiveRoute();
    this.updateView();
  }

  private trackPageOffset() {
    this.pageOffset = -this.documentElement.getBoundingClientRect().top; // represents bottom of page
    console.log('offset', this.pageOffset);
  }

  private updateActiveRoute() {
    this.routes.map((route: StacheNavLink) => {
      console.log(route.offsetTop);
      if ((route.offsetTop - 100) <= this.pageOffset) { // allows us to click to nav with updated highlight
        this.activeRoute = route;
      }
    });
  }

  private updateView() {
    this.routes.map((route: StacheNavLink) => {
      if (route === this.activeRoute) {
        route.isActiveTocAnchor = true;
      } else {
        route.isActiveTocAnchor = false;
      }
    });
  }
}
