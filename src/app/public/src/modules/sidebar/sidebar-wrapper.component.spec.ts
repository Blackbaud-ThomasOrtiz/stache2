import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { expect } from '@blackbaud/skyux-lib-testing';

import { StacheSidebarWrapperComponent } from './sidebar-wrapper.component';
import { StacheSidebarComponent } from './sidebar.component';
import { StacheNavComponent } from '../nav';

import { Subject } from 'rxjs/Subject';

import {
  StacheWindowRef,
  StacheRouteMetadataService,
  StacheRouteService,
  StacheOmnibarAdapterService
} from '../shared';

import { RouterLinkStubDirective } from './fixtures/router-link-stub.directive';
import { StacheLinkModule } from '../link';
import { SkyMediaQueryModule } from '@blackbaud/skyux/dist/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'skyAppResources'
})
export class MockSkyAppResourcesPipe implements PipeTransform {
  public transform(value: number): number {
    return value;
  }
}

describe('StacheSidebarWrapperComponent', () => {
  let component: StacheSidebarWrapperComponent;
  let fixture: ComponentFixture<StacheSidebarWrapperComponent>;
  let mockElement: HTMLElement;
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
     innerWidth: windowWidth,
     document: {
        querySelector() {
          return mockElement;
        },
        querySelectorAll() {}
      }
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
        RouterLinkStubDirective,
        MockSkyAppResourcesPipe
      ],
      imports: [
        RouterTestingModule,
        StacheLinkModule,
        SkyMediaQueryModule
      ],
      providers: [
        { provide: StacheWindowRef, useValue: mockWindowRef },
        { provide: StacheOmnibarAdapterService, useValue: mockOmnibarService },
        { provide: StacheRouteService, useValue: mockRouteService },
        { provide: StacheRouteMetadataService, useValue: { routes: [] } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheSidebarWrapperComponent);
    component = fixture.componentInstance;
    component.sidebarRoutes = mockRouteService.getActiveRoutes();
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should open and close the sidebar', () => {
    expect(component.isOpen).toEqual(true);
    component.toggleSidebar();
    expect(component.isOpen).toEqual(false);
    component.toggleSidebar();
    expect(component.isOpen).toEqual(true);
  });

  it('should be accessible', async(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement).toBeAccessible();
  }));
});
