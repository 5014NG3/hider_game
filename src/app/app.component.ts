import { Component } from '@angular/core';

@Component({
  selector: 'mean-root',
  //templateUrl: './app.component.html',
  template: `
  <div class = "container-md">
    <router-outlet></router-outlet>
  </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
