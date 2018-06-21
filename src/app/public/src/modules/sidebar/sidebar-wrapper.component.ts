import { Component, Input, OnInit, Renderer2, OnDestroy, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { StacheNavLink } from '../nav';
import { StacheOmnibarAdapterService, StacheWindowRef } from '../shared';
import { ENGINE_METHOD_CIPHERS } from 'constants';

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

  private layoutWrapper: HTMLElement;

  private sidebarWrapper: HTMLElement;

  private footerWrapper: HTMLElement;

  private isAffixed: boolean = false;

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
    this.checkWindowWidth();
    this.updateAriaLabel();
  }

  public ngAfterViewInit(): void {
    this.stacheContainers = this.windowRef.nativeWindow.document.querySelectorAll('.stache-container');
    this.sidebarWrapper = this.elementRef.nativeElement.querySelector('.stache-sidebar-wrapper');
    this.layoutWrapper = this.windowRef.nativeWindow.document.querySelector('.stache-layout-wrapper');
    this.footerWrapper = this.windowRef.nativeWindow.document.querySelector('.stache-footer-wrapper');
    this.addClassToContainers();
  }

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.updateAriaLabel();
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    const omnibarHeight = this.omnibarService.getHeight();
    let windowHeight = this.windowRef.nativeWindow.pageYOffset;
    if ((this.layoutWrapper.offsetTop - omnibarHeight) <= windowHeight) {
      this.affixSidebar();
    } else {
      this.resetSidebar()
    }
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

  private affixSidebar(): void {
    let omnibarHeight = this.omnibarService.getHeight();
    let maxHeight = '100%'
    if (this.footerWrapper) {
      maxHeight = `${(this.footerWrapper.offsetTop || 0) - this.windowRef.nativeWindow.pageYOffset - omnibarHeight}px`;
    }

    this.renderer.setStyle(this.sidebarWrapper, 'max-height', `${maxHeight}`);

    if (!this.isAffixed) {
      this.isAffixed = true;
      this.renderer.setStyle(this.sidebarWrapper, 'position', `fixed`);
      this.renderer.setStyle(this.sidebarWrapper, 'top', `${omnibarHeight}px`);
    }
  }

  private resetSidebar(): void {
    if (this.isAffixed) {
      this.isAffixed = false;
      this.renderer.setStyle(this.sidebarWrapper, 'position', `absolute`);
      this.renderer.setStyle(this.sidebarWrapper, 'top', `0`);
    }
  }

  public ngOnDestroy(): void {
    this.removeClassFromContainers();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
