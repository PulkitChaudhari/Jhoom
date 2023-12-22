import { Injectable } from '@angular/core';
declare var SockJS: new (arg0: any) => any;
declare var Stomp: { over: (arg0: any) => any };
import { environment } from '../environment/environment';
import { BehaviorSubject } from 'rxjs';
import { DataShareService } from '../services/data.share.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Initializing websocket connection in constructor
  constructor(private dataShareService: DataShareService) {}

  private stompClient: any;

  initializeWebSocketConnection(userName: string): boolean {
    const serverUrl = environment.app_url;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    var isConnected = true;
    const that = this;
    this.stompClient.connect({}, () => {
      isConnected = true;
      this.stompClient.subscribe('/passport', (messages: any) => {
        console.log(messages);
      });
      that.stompClient.subscribe('/message', (message: any) => {
        if (message.body) {
          console.log(message);
          that.dataShareService.addMessage(message.body);
        }
      });
    });
    return isConnected;
  }

  sendMessage(userObj: any) {
    console.log(userObj);
    this.stompClient.send('/app/send/message', {}, JSON.stringify(userObj));
  }
}
