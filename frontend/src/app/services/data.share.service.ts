import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../model/MessageModel';

@Injectable()
export class DataShareService {
  // Declaring a new behaviorSubject
  private messages$ = new BehaviorSubject<any>({});
  private userName$ = new BehaviorSubject<any>({});
  private roomId$ = new BehaviorSubject<any>({});
  private peerId$ = new BehaviorSubject<any>({});

  messagesObs$ = this.messages$.asObservable();
  userNameObs$ = this.userName$.asObservable();
  roomIdObs$ = this.roomId$.asObservable();
  peerIdObs$ = this.peerId$.asObservable();

  addMessage(message: string) {
    this.messages$.next(message);
  }

  shareUserName(userName: string) {
    this.userName$.next(userName);
  }

  sharePeerId(peerId: string) {
    this.peerId$.next(peerId);
  }

  shareRoomId(roomId: string) {
    this.roomId$.next(roomId);
  }
}
