import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2
} from '@angular/core';

import { StacheWindowRef, StacheOmnibarAdapterService } from '../shared';

const AFFIX_CLASS_NAME: string = 'stache-affix-within-layout';

@Directive({
  selector: '[stacheAffixWithinLayout]'
})
export class StacheAffixWithinLayoutDirective implements AfterViewInit {

  private layoutWrapper: HTMLElement;

  private element: HTMLElement;

  private footerWrapper: HTMLElement;

  private omnibarHeight: number = 0;

  private isAffixed: boolean = false;

  constructor (
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private omnibarService: StacheOmnibarAdapterService,
    private windowRef: StacheWindowRef) { }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    let windowHeight = this.windowRef.nativeWindow.pageYOffset;
    if ((this.layoutWrapper.offsetTop - this.omnibarHeight) <= windowHeight) {
      this.affixSidebar();
    } else {
      this.resetSidebar()
    }
  }

  public ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement;
    this.omnibarHeight = this.omnibarService.getHeight();
    this.layoutWrapper = this.windowRef.nativeWindow.document.querySelector('.stache-layout-wrapper');
    this.footerWrapper = this.windowRef.nativeWindow.document.querySelector('.stache-footer-wrapper');
    this.setMaxHeight();
  }

  private affixSidebar(): void {
    this.setMaxHeight();

    if (!this.isAffixed) {
      this.isAffixed = true;
      this.renderer.setStyle(this.element, 'position', `fixed`);
      this.renderer.setStyle(this.element, 'top', `${this.omnibarHeight}px`);
      this.renderer.addClass(this.element, AFFIX_CLASS_NAME);
    }
  }

  private setMaxHeight() {
    let maxHeight = `calc(100% - ${this.omnibarHeight}px)`;

    if (this.footerIsVisible()) {
      maxHeight = `${this.footerWrapper.offsetTop - this.windowRef.nativeWindow.pageYOffset - this.omnibarHeight}px`;
    }

    this.renderer.setStyle(this.element, 'max-height', `${maxHeight}`);
  }

  private resetSidebar(): void {
    if (this.isAffixed) {
      this.isAffixed = false;
      this.renderer.setStyle(this.element, 'position', `absolute`);
      this.renderer.setStyle(this.element, 'top', `0`);
      this.renderer.removeClass(this.element, AFFIX_CLASS_NAME);
    }
  }

  private  footerIsVisible(): boolean {

    if (this.footerWrapper) {
      return (this.footerWrapper.getBoundingClientRect().top <= this.windowRef.nativeWindow.innerHeight);
    }

    return false;
  }
}
