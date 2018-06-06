import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheSidebarWrapperComponent } from './sidebar-wrapper.component';
import { StacheSidebarComponent } from './sidebar.component';
import { StacheNavComponent, StacheNavService } from '../nav';

import { Subject } from 'rxjs';

import {
  StacheWindowRef,
  StacheRouteMetadataService,
  StacheRouteService,
  StacheOmnibarAdapterService
} from '../shared';

import { RouterLinkStubDirective } from './fixtures/router-link-stub.directive';
import { StacheLinkModule } from '../link';

describe('StacheSidebarWrapperComponent', () => {
  let component: StacheSidebarWrapperComponent;
  let fixture: ComponentFixture<StacheSidebarWrapperComponent>;
  let mockRouteService: any;
  let mockOmnibarService: any;
  let mockWindowRef: any;

  let activeUrl: string = '/';
  let windowWidth = 1000;
  let omnibarHeight = 50;

  class MockRouteService {
    public getActiveUrl() {
      return activeUrl;
    }

    public getActiveRoutes() {
      return [
        {
          name: 'Home',
          path: '',
          children: [
            {
              name: 'Test',
              path: '/test',
              children: [
                {
                  name: 'Test Child',
                  path: '/test/child'
                }
              ]
            }
          ]
        }
      ];
    }
  }

  class MockWindowRef {
    public nativeWindow = {
     innerWidth: windowWidth
    };

    public onResize$ = new Subject();
  }

  class MockOmnibarService {
    public getHeight() {
      return omnibarHeight;
    }
  }

  beforeEach(() => {
    mockRouteService = new MockRouteService();
    mockOmnibarService = new MockOmnibarService();
    mockWindowRef = new MockWindowRef();

    TestBed.configureTestingModule({
      declarations: [
        StacheNavComponent,
        StacheSidebarComponent,
        StacheSidebarWrapperComponent,
        RouterLinkStubDirective
      ],
      imports: [
        RouterTestingModule,
        StacheLinkModule
      ],
      providers: [
        StacheNavService,
        { provide: StacheWindowRef, useValue: mockWindowRef },
        { provide: StacheOmnibarAdapterService, useValue: mockOmnibarService },
        { provide: StacheRouteService, useValue: mockRouteService },
        { provide: StacheRouteMetadataService, useValue: { routes: [] } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheSidebarWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should set the top value for the wrapper based on the omnibar height', () => {
    component.ngOnInit();
    let el = fixture.debugElement.query(By.css('.stache-sidebar-wrapper')).nativeElement;
    expect(el.style.top).toEqual(`${omnibarHeight}px`);

    omnibarHeight = 0;
    component.ngOnInit();
    fixture.detectChanges();
    expect(el.style.top).toEqual(`0px`);
  });

  it('should open and close the sidebar', () => {
    expect(component.sidebarClosed).toEqual(false);
    component.closeSidebar();
    expect(component.sidebarClosed).toEqual(true);
    component.openSidebar();
    expect(component.sidebarClosed).toEqual(false);
  });

  it('should close the sidebar when the window size is below the WINDOW_SIZE_MID', () => {
    expect(component.sidebarClosed).toBe(false);
    mockWindowRef.nativeWindow.innerWidth = 10;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.sidebarClosed).toBe(true);
  });

  it('should open the sidebar when the window size is above the WINDOW_SIZE_MID', () => {
    component.sidebarClosed = true;
    mockWindowRef.nativeWindow.innerWidth = 1000;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.sidebarClosed).toBe(false);
  });

  it('should call the check the window width on window resize', () => {
    component.sidebarClosed = false;
    mockWindowRef.nativeWindow.innerWidth = 10;
    mockWindowRef.onResize$.next();
    fixture.detectChanges();
    expect(component.sidebarClosed).toBe(true);
  });
});
