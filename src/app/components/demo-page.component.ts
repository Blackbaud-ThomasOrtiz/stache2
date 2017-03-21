import { Component, OnInit, Input } from '@angular/core';

import { StacheDemoComponentService } from './demo-component.service';

@Component({
  selector: 'stache-demo-page',
  templateUrl: './demo-page.component.html'
})
export class StacheDemoPageComponent implements OnInit {
  @Input() public name: string;

  public routes = [{
    label: 'Overview',
    path: ['/components']
  }];
  public component;
  public demoFiles;

  public constructor(private componentService: StacheDemoComponentService) {}

  public ngOnInit(): void {
    this.component = this.componentService.getByName(this.name);
    this.demoFiles = this.component.getCodeFiles();

    let components = this.componentService.getAll();
    components.forEach((component) => {
      this.routes.push({
        path: [component.route],
        label: component.name
      });
    });
  }
}
