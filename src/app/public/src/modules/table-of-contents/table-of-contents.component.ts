import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
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

  private documentElement: any;
  private documentBottom: number;
  private pageOffset: number;
  private window: Window;
  private activeRoute: StacheNavLink;

  constructor(
    private cdr: ChangeDetectorRef,
    private windowRef: StacheWindowRef
  ) {
    this.window = this.windowRef.nativeWindow;
    this.documentElement = this.window.document.documentElement;
  }

  public ngAfterViewInit() {
    this.cdr.markForCheck();
    setTimeout(this.updateActiveRoute(), 0);
  }

  @HostListener('window:scroll')
  public onScroll() {
    this.trackPageOffset();
    this.updateActiveRoute();
    this.updateView();
  }

  private trackPageOffset() {
    // Represents top of page
    // 300px buffer given to aid with click visualization
    this.pageOffset = (this.window.pageYOffset - 300);

    // Tracks page bottom so final route can be highlighted if associated anchor provides limited content
    // (Logic based on Angular implementation)
    this.documentBottom = Math.round(this.documentElement.getBoundingClientRect().bottom);
  }

  private updateActiveRoute() {
    if (this.window.innerHeight === this.documentBottom) {
      this.activeRoute = this.routes[this.routes.length - 1];
      return;
    }

    this.routes.map((route: StacheNavLink) => {
      console.log(route.offsetTop);
      console.log(this.pageOffset);
      if (route.offsetTop <= this.pageOffset) {
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
