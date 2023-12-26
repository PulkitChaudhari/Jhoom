import { Injectable } from '@angular/core';
declare var SockJS: new (arg0: any) => any;
declare var Stomp: { over: (arg0: any) => any };
import { environment } from '../environment/environment';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DataShareService } from '../services/data.share.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Initializing websocket connection in constructor
  constructor(private dataShareService: DataShareService) {}

  private stompClient: any;

  meetingRoomId: string;

  initializeWebSocketConnection(userName: string): boolean {
    const serverUrl = environment.app_url;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    var isConnected = true;
    const that = this;
    this.stompClient.connect({}, () => {
      isConnected = true;
      this.stompClient.subscribe('/passport', (message: any) => {
        console.log(message);
        this.meetingRoomId = message;
      });
      this.stompClient.subscribe('/tempoo', (message: any) => {
        console.log(message);
      });
      that.stompClient.subscribe('/message', (message: any) => {
        if (message.body) {
          console.log(message);
          that.dataShareService.addMessage(message.body);
        }
      });
      // const subscriptionAddess: string = '/user/pulkit/queue/private';
      // this.stompClient.subscribe(subscriptionAddess, (message: any) => {
      //   console.log(message);
      // });
    });
    return isConnected;
  }

  sendMessage(userObj: any) {
    this.stompClient.send('/app/send/message', {}, JSON.stringify(userObj));
  }

  createRoom(userObj: any) {
    this.stompClient.send('/app/createRoom', {}, JSON.stringify(userObj));
  }

  joinRoom(details: any) {
    this.stompClient.send('/app/joinRoom', {}, JSON.stringify(details));
  }
}
