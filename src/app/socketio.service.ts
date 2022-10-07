import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: Socket;

  constructor() { }

  setupSocketConnection(){
    this.socket = io(environment.SOCKET_ENDPOINT)
    
    console.log("setup connection")

    this.socket.emit('user message', 'Hello from te client?')



    //console.log(this.socket)



    this.socket.on('server msg', async (data:any) => {
      console.log("IP: " + data["IP" as keyof JSON])
      console.log("UID: " + data["UID" as keyof JSON])
      console.log("LOBBY: " + data["LOBBY" as keyof JSON])
      

      this.socket.emit('user update', data["UID" as keyof JSON])

    })


    this.socket.on('server update', async (data:any) => {
      console.log(data + " caused an update")
      

    })



  }


  disconnect(){
    if(this.socket){
      this.socket.disconnect();
    }
  }
}
