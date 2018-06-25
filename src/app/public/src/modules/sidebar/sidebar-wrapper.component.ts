import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';

import {
  SkyMediaQueryService,
  SkyMediaBreakpoints
} from '@blackbaud/skyux/dist/core';

import {
  Subscription
} from 'rxjs/Subscription';

import {
  StacheNavLink
} from '../nav';

let nextUniqueId = 0;

@Component({
  selector: 'stache-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styleUrls: ['./sidebar-wrapper.component.scss']
})
export class StacheSidebarWrapperComponent implements OnInit, OnDestroy {
  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Output()
  public toggle = new EventEmitter<any>();

  public elementId = 'stache-sidebar-content-panel-' + nextUniqueId++;
  public isOpen = true;

  private mediaQuerySubscription: Subscription;

  constructor(
    private mediaQueryService: SkyMediaQueryService
  ) { }

  public ngOnInit(): void {
    this.mediaQuerySubscription = this.mediaQueryService
      .subscribe((args: SkyMediaBreakpoints) => {
        this.isOpen = (args === SkyMediaBreakpoints.xs);
        this.toggleSidebar();
      });
  }

  public ngOnDestroy(): void {
    this.toggle.complete();
    this.mediaQuerySubscription.unsubscribe();
  }

  public toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.toggle.emit({
      state: this.isOpen
    });
  }
}
