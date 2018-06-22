import { Component, Input, OnInit, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { StacheNavLink } from '../nav';
import { StacheWindowRef } from '../shared';

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
    this.checkWindowWidth();
    this.updateAriaLabel();
  }

  public ngAfterViewInit(): void {
    this.stacheContainers = this.windowRef.nativeWindow.document.querySelectorAll('.stache-container');
    this.addClassToContainers();
  }

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.updateAriaLabel();
  }

  private checkWindowWidth(): void {
    let windowWidth = this.windowRef.nativeWindow.innerWidth;

    if (windowWidth <= WINDOW_SIZE_MID) {
      this.sidebarOpen = false;
    } else {
      this.sidebarOpen = true;
    }
  }

  private updateAriaLabel(): void {
    this.sidebarLabel = this.sidebarOpen ? 'Click to close sidebar' : 'Click to open sidebar';
  }

  private addClassToContainers(): void {
    if (this.stacheContainers && this.stacheContainers.length) {
      this.stacheContainers.forEach((container: HTMLElement) => {
        this.renderer.addClass(container, CONTAINER_SIDEBAR_CLASSNAME);
      });
    }
  }

  private removeClassFromContainers(): void {
    if (this.stacheContainers && this.stacheContainers.length) {
      this.stacheContainers.forEach((container: HTMLElement) => {
        this.renderer.removeClass(container, CONTAINER_SIDEBAR_CLASSNAME);
      });
    }
  }

  public ngOnDestroy(): void {
    this.removeClassFromContainers();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
