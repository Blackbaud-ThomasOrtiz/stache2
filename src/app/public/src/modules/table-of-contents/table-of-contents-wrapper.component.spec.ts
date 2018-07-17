import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {Pipe, PipeTransform} from '@angular/core';

import { expect } from '@blackbaud/skyux-lib-testing';
import { StacheNavComponent, StacheNavService, StacheNavLink } from '../nav';

import { Subject } from 'rxjs';

import {
  StacheWindowRef,
  StacheRouteMetadataService,
  StacheRouteService,
  StacheOmnibarAdapterService
} from '../shared';
import { StacheLinkModule } from '../link';
import { SkyAppResourcesService } from '@blackbaud/skyux-builder/runtime/i18n';
import { SkyMediaQueryModule } from '@blackbaud/skyux/dist/core';
import { StacheTableOfContentsWrapperComponent } from './table-of-contents-wrapper.component';
import { StacheTableOfContentsComponent } from './table-of-contents.component';

@Pipe({
  name: 'skyAppResources'
})
export class MockSkyAppResourcesPipe implements PipeTransform {
  public transform(value: number): number {
    return value;
  }
}

class MockSkyAppResourcesService {
  public getString(): any {
    return {
      subscribe: (cb: any) => {
        cb();
      },
      take: () => {
        return {
          subscribe: (cb: any) => {
            cb();
          }
        };
      }
    };
  }
}

fdescribe('StacheTableOfContentsWrapperComponent', () => {
  const CONTAINER_TOC_CLASSNAME = 'stache-table-of-contents-enabled';
  let component: StacheTableOfContentsWrapperComponent;
  let fixture: ComponentFixture<StacheTableOfContentsWrapperComponent>;
  let mockElement: HTMLElement = document.createElement('div');
  let mockRouteService: any;
  let mockOmnibarService: any;
  let mockWindowRef: any;
  let mockSkyAppResourcesService: any;

  let activeUrl: string = '/';
  let windowWidth = 1000;
  let omnibarHeight = 50;

  const route: StacheNavLink = {
    name: 'string',
    path: '/test',
    offsetTop: 100,
    isActiveTocAnchor: false
  };

  class MockRouteService {
    public getActiveUrl() {
      return activeUrl;
    }

    public getActiveRoutes() {
      return [route];
    }
  }

  class MockWindowService {
    public nativeWindow = {
      document: {
        documentElement: {
          getBoundingClientRect: () => {
            return { bottom: 100 };
          },
          querySelector: () => {
            return this.testElement;
          }
        }
      },
      innerHeight: 100,
      pageYOffset: 400
    };

    public testElement = {
      offsetTop: 100
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
    mockWindowRef = new MockWindowService();
    mockSkyAppResourcesService = new MockSkyAppResourcesService();

    TestBed.configureTestingModule({
      declarations: [
        StacheNavComponent,
        StacheTableOfContentsComponent,
        StacheTableOfContentsWrapperComponent,
        MockSkyAppResourcesPipe
      ],
      imports: [
        RouterTestingModule,
        StacheLinkModule,
        SkyMediaQueryModule
      ],
      providers: [
        StacheNavService,
        { provide: SkyAppResourcesService, useValue: mockSkyAppResourcesService },
        { provide: StacheWindowRef, useValue: mockWindowRef },
        { provide: StacheOmnibarAdapterService, useValue: mockOmnibarService },
        { provide: StacheRouteService, useValue: mockRouteService },
        { provide: StacheRouteMetadataService, useValue: { routes: [] } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTableOfContentsWrapperComponent);
    fixture.detectChanges();
    fixture.debugElement.nativeElement.classList = ['stache-tutorial-step'];
    component = fixture.componentInstance;
    component.tocRoutes = mockRouteService.getActiveRoutes();
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should open and close the table of contents', () => {
    component.tocOpen = false;
    component.toggleToc();
    expect(component.tocOpen).toEqual(true);
    component.toggleToc();
    expect(component.tocOpen).toEqual(false);
  });

  it('should call the check the window width on window resize', () => {
    component.tocOpen = false;
    mockWindowRef.nativeWindow.innerWidth = 10;
    mockWindowRef.onResize$.next();
    fixture.detectChanges();
    expect(component.tocOpen).toBe(false);
  });

  it('should be accessible', async(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement).toBeAccessible();
  }));

  it(`should add the class ${ CONTAINER_TOC_CLASSNAME } to the body if one exists`, () => {
    component.ngAfterViewInit();
    expect(mockElement.className).toContain(CONTAINER_TOC_CLASSNAME);
    mockElement.remove();
  });

  it(`should remove the class ${ CONTAINER_TOC_CLASSNAME } from the body on destroy`, () => {
    component.ngAfterViewInit();
    expect(mockElement.className).toContain(CONTAINER_TOC_CLASSNAME);
    component.ngOnDestroy();
    expect(mockElement.className).not.toContain(CONTAINER_TOC_CLASSNAME);
    mockElement.remove();
  });
});
