import { Component, OnInit } from '@angular/core';

import { StacheNavLink } from '../nav';

import { StacheConfigService } from '../shared';

const _get = require('lodash.get');

@Component({
  selector: 'stache-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class StacheFooterComponent implements OnInit {
  public copyright: string;
  public siteName: string;
  public resourceLinks: StacheNavLink[];

  constructor(private configService: StacheConfigService) { }

  public ngOnInit(): void {
    this.setFooterData();
  }

  private setFooterData(): void {
    this.resourceLinks = _get(this.configService, 'skyux.appSettings.stache.footer.resourceLinks', []);
    this.copyright = _get(this.configService, 'skyux.appSettings.stache.footer.copyright', `Blackbaud, Inc. All rights reserved.`);
    this.siteName = _get(this.configService, 'skyux.appSettings.name', `Stache`);
  }
}
