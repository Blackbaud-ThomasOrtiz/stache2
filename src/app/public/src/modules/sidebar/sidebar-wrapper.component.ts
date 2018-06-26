import { Component, Input, OnInit, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SkyMediaQueryService, SkyMediaBreakpoints } from '@blackbaud/skyux/dist/core';

import { StacheNavLink } from '../nav';
import { StacheWindowRef } from '../shared';

const CONTAINER_SIDEBAR_CLASSNAME: string  = 'stache-container-sidebar';
let nextUniqueId = 0;

@Component({
  selector: 'stache-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styleUrls: ['./sidebar-wrapper.component.scss']
})
export class StacheSidebarWrapperComponent implements  OnDestroy, AfterViewInit {
  @Input()
  public sidebarRoutes: StacheNavLink[];

  public isOpen: boolean = false;

  public sidebarLabel: string = 'Click to open sidebar';

  public elementId = `stache-sidebar-content-panel-${(nextUniqueId++)}`;

  private stacheContainers: HTMLElement[];

  private mediaQuerySubscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private windowRef: StacheWindowRef,
    private mediaQueryService: SkyMediaQueryService
  ) {

    this.mediaQuerySubscription = this.mediaQueryService
     .subscribe((args: SkyMediaBreakpoints) => {
       this.isOpen = (args <= SkyMediaBreakpoints.sm);
       this.toggleSidebar();
     });
  }

  public ngAfterViewInit(): void {
    this.stacheContainers = this.windowRef.nativeWindow.document.querySelectorAll('.stache-container');
    this.addClassToContainers();
  }

  public toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  public ngOnDestroy(): void {
    this.removeClassFromContainers();
    this.mediaQuerySubscription.unsubscribe();
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
