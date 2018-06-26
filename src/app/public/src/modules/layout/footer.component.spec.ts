import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@blackbaud/skyux-lib-testing';

import { StacheFooterComponent } from './footer.component';
import { StacheNavModule } from '../nav';
import { StacheConfigService, StacheWindowRef, StacheRouteService } from '../shared';

describe('StacheFooterComponent', () => {
  let component: StacheFooterComponent;
  let fixture: ComponentFixture<StacheFooterComponent>;
  let mockConfigService: any;
  let mockRouterService: any;

  let footerConfig = {
    nav: [
      {
        title: 'Privacy Policy',
        route: '/demos/privacy-policy'
      },
      {
        title: 'Terms of Use',
        route: '/demos/anchor-link'
      }
    ],
    copyright: 'test copyright'
  };

  class MockConfigService {
    public skyux = {
      appSettings: {
        name: 'Some Name',
        stache: {
          footer: footerConfig
        }
      }
    };
  }

  class MockRouterService {
    public getActiveUrl() { }
  }

  beforeEach(() => {
    mockConfigService = new MockConfigService();
    mockRouterService = new MockRouterService();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StacheNavModule
      ],
      declarations: [
        StacheFooterComponent
      ],
      providers: [
        StacheWindowRef,
        { provide: StacheRouteService, useValue: mockRouterService },
        { provide: StacheConfigService, useValue: mockConfigService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StacheFooterComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should update the footer settings based on the skyux config', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.footerLinks).toExist();
    expect(component.copyright).toBe(footerConfig.copyright);
    expect(component.siteName).toBe(mockConfigService.skyux.name);
  });

  it('should map the footerLinks from the skyux config to stacheNavLinks', () => {
    component.ngOnInit();
    fixture.detectChanges();

    let mappedFooterLinks = footerConfig.nav.map((navItem: any) => {
      return {
        name: navItem.title,
        path: navItem.route
      };
    });

    expect(component.footerLinks).toEqual(mappedFooterLinks);
  });

  it('should provide defaults if no values are supplied', () => {
    mockConfigService.skyux.appSettings.stache.footer = {};
    mockConfigService.skyux.appSettings.name = undefined;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.footerLinks).not.toEqual(footerConfig.nav);
    expect(component.footerLinks).toEqual([]);

    expect(component.copyright).not.toEqual(footerConfig.copyright);
    expect(component.copyright).toEqual('Blackbaud, Inc. All rights reserved.');

    expect(component.siteName).toBe(undefined);
  });

  it('should be accessible', async(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement).toBeAccessible();
  }));
});
