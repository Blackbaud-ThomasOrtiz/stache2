import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheFooterComponent } from './footer.component';
import { StacheLinkModule } from '../link';
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
        StacheLinkModule
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
    expect(component.footerLinks).toBe(footerConfig.nav);
    expect(component.copyright).toBe(footerConfig.copyright);
    expect(component.siteName).toBe(mockConfigService.skyux.appSettings.name);
  });

  it('should provide defaults if no values are supplied', () => {
    mockConfigService.skyux.appSettings.stache.footer = {};
    mockConfigService.skyux.appSettings.name = undefined;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.footerLinks).not.toEqual(footerConfig.nav);
    expect(component.footerLinks).toBe(undefined);

    expect(component.copyright).not.toEqual(footerConfig.copyright);
    expect(component.copyright).toEqual('Blackbaud, Inc. All rights reserved.');

    expect(component.siteName).toBe(undefined);
  });
});
