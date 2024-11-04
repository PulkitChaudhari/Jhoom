import { Injectable } from '@angular/core';
declare var SockJS: new (arg0: any) => any;
declare var Stomp: { over: (arg0: any) => any };
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { DataShareService } from '../services/data.share.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private dataShareService: DataShareService,
    private http: HttpClient
  ) {}

  private stompClient: any;

  meetingRoomId: string;

  initializeWebSocketConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      const serverUrl = environment.app_url + '/socket';
      const ws = new SockJS(serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect(
        {},
        () => resolve(true),
        () => reject(false)
      );
    });
  }

  getPeerIds() {
    this.stompClient.subscribe('/sharePeerIds', (peerId: any) => {
      this.dataShareService.shareOtherPeerId(peerId.body);
    });
  }

  sendMessage(userObj: any) {
    this.stompClient.send('/app/room/notif', {}, JSON.stringify(userObj));
  }

  fetchWSMessages() {
    this.stompClient.subscribe('/messages', (msg: any) => {
      this.dataShareService.shareMessage(msg);
    });
  }

  getRoomUpdates(): any {
    return this.stompClient;
  }

  getStompClient(): any {
    return this.stompClient;
  }

  createRoom(): Observable<any> {
    return this.http.get(environment.app_url + '/createRoom', {
      responseType: 'text',
    });
  }

  joinRoom(details: any, roomId: string): Observable<any> {
    return this.http.post(
      environment.app_url + '/joinRoom/' + roomId,
      JSON.stringify(details),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getMessages(roomId: string): Observable<any> {
    return this.http.get(environment.app_url + '/getMessages/' + roomId, {
      responseType: 'text',
    });
  }
}
