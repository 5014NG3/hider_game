import { Component, OnInit } from '@angular/core';
import { SocketioService } from './socketio.service';

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
export class AppComponent implements OnInit{
  title = 'socketio-angular';
  constructor(private socketService: SocketioService){}


  ngOnInit(){
    this.socketService.setupSocketConnection();
  
  }


  ngOnDestroy(){

    this.socketService.disconnect();
  }
}
