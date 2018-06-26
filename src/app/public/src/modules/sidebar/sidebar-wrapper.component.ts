import { Component, Input, OnInit, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { StacheNavLink } from '../nav';
import { StacheWindowRef } from '../shared';
import { SkyMediaQueryService, SkyMediaBreakpoints } from '@blackbaud/skyux/dist/core';

const WINDOW_SIZE_MID: number = 992;
const CONTAINER_SIDEBAR_CLASSNAME: string  = 'stache-container-sidebar';
let nextUniqueId = 0;

@Component({
  selector: 'stache-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styleUrls: ['./sidebar-wrapper.component.scss']
})
export class StacheSidebarWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public sidebarRoutes: StacheNavLink[];

  public isOpen: boolean = false;

  public sidebarLabel: string = 'Click to open sidebar';

  private ngUnsubscribe: Subject<any> = new Subject();
  public elementId = 'stache-sidebar-content-panel-' + nextUniqueId++;

  private stacheContainers: HTMLElement[];

  private mediaQuerySubscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private windowRef: StacheWindowRef,
    private mediaQueryService: SkyMediaQueryService
  ) {

    this.mediaQuerySubscription = this.mediaQueryService
     .subscribe((args: SkyMediaBreakpoints) => {
       this.isOpen = (args === SkyMediaBreakpoints.xs);
       this.toggleSidebar();
     });

    this.windowRef.onResize$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.checkWindowWidth();
        this.updateAriaLabel();
      });
  }

  public ngOnInit(): void {
    this.checkWindowWidth();
    this.updateAriaLabel();
  }

  public ngAfterViewInit(): void {
    this.stacheContainers = this.windowRef.nativeWindow.document.querySelectorAll('.stache-container');
    this.addClassToContainers();
  }

  public toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.updateAriaLabel();
  }

  public ngOnDestroy(): void {
    this.removeClassFromContainers();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.mediaQuerySubscription.unsubscribe();
  }

  private checkWindowWidth(): void {
    let windowWidth = this.windowRef.nativeWindow.innerWidth;

    if (windowWidth <= WINDOW_SIZE_MID) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }

  private updateAriaLabel(): void {
    this.sidebarLabel = this.isOpen ? 'Click to close sidebar' : 'Click to open sidebar';
  }

  private addClassToContainers(): void {
    if (this.stacheContainers && this.stacheContainers.length) {
      Array.prototype.forEach.call(this.stacheContainers, (container: HTMLElement) => {
        this.renderer.addClass(container, CONTAINER_SIDEBAR_CLASSNAME);
      });
    }
  }

  private removeClassFromContainers(): void {
    if (this.stacheContainers && this.stacheContainers.length) {
      Array.prototype.forEach.call(this.stacheContainers, (container: HTMLElement) => {
        this.renderer.removeClass(container, CONTAINER_SIDEBAR_CLASSNAME);
      });
    }
  }
}
