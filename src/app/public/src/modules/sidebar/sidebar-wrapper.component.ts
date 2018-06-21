import { Component, Input, OnInit, Renderer2, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { StacheNavLink } from '../nav';
import { StacheOmnibarAdapterService, StacheWindowRef } from '../shared';

const WINDOW_SIZE_MID: number = 992;
const CONTAINER_SIDEBAR_CLASSNAME: string  = 'stache-container-sidebar';

@Component({
  selector: 'stache-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styleUrls: ['./sidebar-wrapper.component.scss']
})
export class StacheSidebarWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public sidebarRoutes: StacheNavLink[];

  public sidebarOpen: boolean = false;

  public sidebarLabel: string = 'Click to open sidebar';

  private ngUnsubscribe: Subject<any> = new Subject();

  private stacheContainers: HTMLElement[];

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
        this.updateAriaLabel();
      });
  }

  public ngOnInit(): void {
    this.setTopAffix();
    this.checkWindowWidth();
    this.updateAriaLabel();
  }

  public ngAfterViewInit(): void {
    this.stacheContainers = this.windowRef.nativeWindow.document.querySelectorAll('.stache-container');
    if (this.stacheContainers && this.stacheContainers.length) {
      this.stacheContainers.forEach((container: HTMLElement) => {
        this.renderer.addClass(container, CONTAINER_SIDEBAR_CLASSNAME);
      });
    }
  }

  public setTopAffix(): void {
    let omnibarHeight = this.omnibarService.getHeight();
    let wrapperElement = this.elementRef.nativeElement.querySelector('.stache-sidebar-wrapper');
    this.renderer.setStyle(wrapperElement, 'top', `${omnibarHeight}px`);
  }

  public ngOnDestroy(): void {
    if (this.stacheContainers && this.stacheContainers.length) {
      this.stacheContainers.forEach((container: HTMLElement) => {
        this.renderer.removeClass(container, CONTAINER_SIDEBAR_CLASSNAME);
      });
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.updateAriaLabel();
  }

  public updateAriaLabel(): void {
    this.sidebarLabel = this.sidebarOpen ? 'Click to close sidebar' : 'Click to open sidebar';
  }

  private checkWindowWidth(): void {
    let windowWidth = this.windowRef.nativeWindow.innerWidth;

    if (windowWidth <= WINDOW_SIZE_MID) {
      this.sidebarOpen = false;
    } else {
      this.sidebarOpen = true;
    }
  }
}
