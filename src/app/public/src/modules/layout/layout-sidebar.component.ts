import { Component, Input, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StacheLayout } from './layout';
import { InputConverter, StacheOmnibarAdapterService, StacheWindowRef } from '../shared';
import { StacheNavLink } from '../nav';
import { Subject } from 'rxjs';

const WINDOW_SIZE_MID = 992;

@Component({
  selector: 'stache-layout-sidebar',
  templateUrl: './layout-sidebar.component.html',
  styleUrls: ['./layout-sidebar.component.scss']
})
export class StacheLayoutSidebarComponent implements StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public inPageRoutes: StacheNavLink[];

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  @InputConverter()
  public showBackToTop: boolean;

  @Input()
  @InputConverter()
  public showBreadcrumbs: boolean;

  @Input()
  @InputConverter()
  public showEditButton: boolean;

  @Input()
  @InputConverter()
  public showTableOfContents: boolean;

  public sidebarClosed: boolean = false;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private renderer: Renderer2,
    private omnibarService: StacheOmnibarAdapterService,
    private windowRef: StacheWindowRef
  ) {
    this.windowRef.onResize$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.checkWindowWidth();
      });
  }

  public ngOnInit() {
    let omnibarHeight = this.omnibarService.getHeight();
    let sidebarWrapperEl = this.windowRef.nativeWindow.document.querySelector('#stache-sidebar-wrapper');
    this.renderer.setStyle(sidebarWrapperEl, 'top', `${omnibarHeight}px`);
    this.checkWindowWidth();
  }

  public closeSidebar() {
    this.sidebarClosed = true;
  }

  public openSidebar() {
    this.sidebarClosed = false;
  }

  private checkWindowWidth() {
    let windowWidth = this.windowRef.nativeWindow.innerWidth;

    if (windowWidth < WINDOW_SIZE_MID) {
      this.sidebarClosed = true;
    }

    if (windowWidth > WINDOW_SIZE_MID) {
      this.sidebarClosed = false;
    }
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
