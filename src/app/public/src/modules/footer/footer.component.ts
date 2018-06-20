import { Component, OnInit } from '@angular/core';
import { StacheConfigService } from '../shared';
import { StacheNavLink } from '../nav';

const _get = require('lodash.get');

@Component({
  selector: 'stache-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class StacheFooterComponent implements OnInit {
  public copyright: string;
  public currentDate: Date;
  public siteName: string;
  public footerLinks: StacheNavLink[];

  constructor(private configService: StacheConfigService) { }

  public ngOnInit(): void {
    this.currentDate = new Date();
    this.setFooterData();
  }

  private setFooterData(): void {
    let footerLinksFromConfig = _get(this.configService, 'skyux.appSettings.stache.footer.nav', []);
    this.formatLinks(footerLinksFromConfig);
    this.copyright = _get(this.configService, 'skyux.appSettings.stache.footer.copyright', `Blackbaud, Inc. All rights reserved.`);
    this.siteName = _get(this.configService, 'skyux.app.title');
  }

  private formatLinks(configLink: any[]): void {
    this.footerLinks = configLink.map((link) => {
      return {
        name: link.title,
        path: link.route
      } as StacheNavLink;
    });
  }
}
