import { Component, Input, OnInit, Renderer2, OnDestroy, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { StacheNavLink } from '../nav';
import { StacheOmnibarAdapterService, StacheWindowRef } from '../shared';

const WINDOW_SIZE_MID = 992;

@Component({
  selector: 'stache-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styleUrls: ['./sidebar-wrapper.component.scss']
})
export class StacheSidebarWrapperComponent implements OnInit, OnDestroy {
  @Input()
  public sidebarRoutes: StacheNavLink[];

  public sidebarClosed: boolean = false;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private omnibarService: StacheOmnibarAdapterService,
    private windowRef: StacheWindowRef
  ) {
    this.windowRef.onResize$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.checkWindowWidth();
      });
  }

  public ngOnInit(): void {
    this.setTopAffix();
    this.checkWindowWidth();
  }

  public setTopAffix(): void {
    let omnibarHeight = this.omnibarService.getHeight();
    let wrapperElement = this.elementRef.nativeElement.querySelector('.stache-sidebar-wrapper');
    this.renderer.setStyle(wrapperElement, 'top', `${omnibarHeight}px`);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public closeSidebar(): void {
    this.sidebarClosed = true;
  }

  public openSidebar(): void {
    this.sidebarClosed = false;
  }

  private checkWindowWidth(): void {
    let windowWidth = this.windowRef.nativeWindow.innerWidth;

    if (windowWidth < WINDOW_SIZE_MID) {
      this.sidebarClosed = true;
    }

    if (windowWidth > WINDOW_SIZE_MID) {
      this.sidebarClosed = false;
    }
  }
}
