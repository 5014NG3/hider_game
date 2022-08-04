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
export class AppComponent {
  note = 'This is mine now haha';

  public get currentYear() : number {
    return new Date().getFullYear();
  }

}
