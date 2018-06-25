import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, inject, tick, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheAffixWithinLayoutDirective } from './affix-top.directive';
import { AffixWithinLayoutTestComponent } from './fixtures/affix-within-layout.component.fixture';
import { StacheCodeComponent } from '../code';

import { StacheWindowRef, StacheOmnibarAdapterService, TestUtility } from '../shared';

describe('AffixTopTestDirective', () => {
  const className: string = StacheAffixWithinLayoutDirective.AFFIX_CLASS_NAME;
  let testOmnibarHeight: number = 0;

  const mockFooterElement: HTMLElement = document.createElement('div');
  const mockLayoutElement: HTMLElement = document.createElement('div');
  class MockOmnibarService {
    public getHeight(): number {
      return testOmnibarHeight;
    }
  }

  class MockWindowRef {
    public nativeWindow = {
     document: {
        querySelector(selector: string) {
          switch (selector) {
            case '.stache-layout-wrapper':
              return mockLayoutElement;
              break;
            case '.stache-footer-wrapper':
              return mocFooterElement;
              break;
          }
          return document.createElement('div');
        },
      }
    };
}

  let mockOmnibarService = new MockOmnibarService();
  let mockWindowRef = new MockWindowRef();
  let component: AffixWithinLayoutTestComponent;
  let fixture: ComponentFixture<AffixWithinLayoutTestComponent>;
  let directiveElements: any[];
  let windowRef: any;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheAffixWithinLayoutDirective,
        AffixWithinLayoutTestComponent,
        StacheCodeComponent
      ],
      providers: [
        { provide: StacheWindowRef, useValue: mockWindowRef },
        {
          provide: StacheOmnibarAdapterService,
          useValue: mockOmnibarService
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffixWithinLayoutTestComponent);
    component = fixture.componentInstance;
    directiveElements = fixture.debugElement.queryAll(By.directive(StacheAffixWithinLayoutDirective));
  });

  beforeEach(inject([StacheWindowRef], (service: any) => {
    windowRef = service.nativeWindow;
  }));

  it('should exist on the component', () => {
    expect(directiveElements[0]).not.toBeNull();
  });

  it('should call the on window scroll method when the window scrolls', fakeAsync(() => {
      const directiveInstance = directiveElements[0].injector.get(StacheAffixWithinLayoutDirective);

      fixture.detectChanges();
      tick();

      spyOn(directiveInstance, 'onWindowScroll').and.callThrough();
      TestUtility.triggerDomEvent(windowRef, 'scroll');

      expect(directiveInstance.onWindowScroll).toHaveBeenCalled();
    })
  );

  it('should add or remove stache-affix-top class based on offset to window ratio',
    fakeAsync(() => {
      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '50px';

      windowRef.scrollTo(0, 500);
      fixture.detectChanges();
      tick();

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).toHaveCssClass(className);

      windowRef.scrollTo(0, 0);
      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);
    })
  );

  it('should take the omnibar height into consideration in the offset to window ratio',
    fakeAsync(() => {
      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '50px';

      windowRef.scrollTo(0, 25);
      fixture.detectChanges();
      tick();

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);

      testOmnibarHeight = 50;
      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).toHaveCssClass(className);

      testOmnibarHeight = 0;
    })
  );

  it('should add or remove stache-affix-top class to a component\'s first child',
    fakeAsync(() => {
      const element = directiveElements[1].nativeElement.children[0];

      windowRef.scrollTo(0, 500);
      fixture.detectChanges();
      tick();

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).toHaveCssClass(className);

      windowRef.scrollTo(0, 0);
      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);
    })
  );

  it('should not attempt to reset the element if it already has',
    fakeAsync(() => {
      const element = directiveElements[0].nativeElement;
      element.style.marginTop = '500px';

      fixture.detectChanges();
      tick();

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);

      TestUtility.triggerDomEvent(windowRef, 'scroll');
      expect(element).not.toHaveCssClass(className);
    })
  );
});
