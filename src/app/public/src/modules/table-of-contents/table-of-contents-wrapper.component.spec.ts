import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { expect } from '@blackbaud/skyux-lib-testing';
import { StacheNavComponent, StacheNavService, StacheNavLink } from '../nav';
import { Subject } from 'rxjs';
import { StacheLinkModule } from '../link';
import { SkyAppResourcesService } from '@blackbaud/skyux-builder/runtime/i18n';
import { SkyMediaQueryModule } from '@blackbaud/skyux/dist/core';
import { StacheTableOfContentsWrapperComponent } from './table-of-contents-wrapper.component';
import { StacheTableOfContentsComponent } from './table-of-contents.component';
import { StacheWindowRef } from '../shared';

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

describe('StacheTableOfContentsWrapperComponent', () => {
  let component: StacheTableOfContentsWrapperComponent;
  let fixture: ComponentFixture<StacheTableOfContentsWrapperComponent>;
  let mockElement: Element = document.createElement('body');
  let mockWindowRef: any;
  let mockSkyAppResourcesService: any;

  class MockWindowService {
    public nativeWindow = {
      document: {
        body: mockElement,
        documentElement: {
          getBoundingClientRect: () => {
            return { bottom: 100 };
          },
          querySelector: jasmine.createSpy('querySelector').and.callFake(function(selector: string) {
            return {
              textContent: 'test',
              classList: {
                add(cssClass: string) { }
              },
              scrollIntoView() { },
              offsetHeight: 50,
              getBoundingClientRect() {
                return {
                  top: 100
                };
              }
            };
          })
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

  const route: StacheNavLink = {
    name: 'string',
    path: '/string',
    offsetTop: 123,
    isActiveTocAnchor: false
  };

  beforeEach(() => {
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
        StacheLinkModule,
        SkyMediaQueryModule
      ],
      providers: [
        StacheNavService,
        { provide: SkyAppResourcesService, useValue: mockSkyAppResourcesService },
        { provide: StacheWindowRef, useValue: mockWindowRef }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTableOfContentsWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    component.tocRoutes = [ route ];
    component.ngAfterViewInit();
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
});
