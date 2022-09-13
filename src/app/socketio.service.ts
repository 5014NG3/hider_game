import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket;

  constructor() { }

  setupSocketConnection(){
    this.socket = io(environment.SOCKET_ENDPOINT)

    this.socket.emit('user message', 'Hello from te client?')

    this.socket.on('server msg', (data:string) => {
      console.log(data)
    })

  }


  disconnect(){
    if(this.socket){
      this.socket.disconnect();
    }
  }
}
