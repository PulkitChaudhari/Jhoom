import { Injectable } from '@angular/core';
declare var SockJS: new (arg0: any) => any;
declare var Stomp: { over: (arg0: any) => any };
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {
    this.initializeWebSocketConnection();
  }
  public stompClient: any;
  public msg = [];
  initializeWebSocketConnection() {
    const serverUrl = environment.app_url;
    console.log(serverUrl);
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function (frame: any) {
      that.stompClient.subscribe('/message', (message: any) => {
        if (message.body) {
          console.log(message);
        }
      });
    });
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/send/message', {}, message);
  }
}
