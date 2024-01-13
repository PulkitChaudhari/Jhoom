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

  initializeWebSocketConnection() : Promise<any> {
    return new Promise((resolve,reject)=>{
      const serverUrl = environment.app_url;
      const ws = new SockJS(serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => resolve(true),()=>reject(false));
    })
  }

  getPeerIds() {
    this.stompClient.subscribe('/sharePeerIds',(peerId:string)=>{
      console.log(JSON.parse(peerId));
    });
  }

  sendMessage(userObj: any) {
    this.stompClient.send('/app/send/message', {}, JSON.stringify(userObj)).subscribe((msg:any)=>{
        console.log(JSON.parse(msg));
    })
  }

  fetchWSMessages() {
    this.stompClient.subscribe('/messages',(msg:any)=>{
      this.dataShareService.shareMessage(msg);
    });
  }

  createRoom(userObj: any) : Observable<any> {
    return this.http
      .post('http://localhost:8082/createRoom', JSON.stringify(userObj), {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'text'
      });
  }

  joinRoom(details: any, roomId: string) : Observable<any>  {
    return this.http
      .post('http://localhost:8082/joinRoom/' + roomId, JSON.stringify(details), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  }

  getMessages(roomId:string):Observable<any>{
    return this.http.get('http://localhost:8082/getMessages/'+roomId,
    {responseType: 'text'});
  }
}
