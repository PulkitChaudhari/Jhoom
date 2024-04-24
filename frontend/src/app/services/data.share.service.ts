import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../model/MessageModel';

@Injectable()
export class DataShareService {
  // Declaring a new behaviorSubject
  private prevMessages$ = new BehaviorSubject<any>([]);
  private wsMessages$ = new BehaviorSubject<any>({});
  private userName$ = new BehaviorSubject<any>({});
  private roomId$ = new BehaviorSubject<any>({});
  private peerId$ = new BehaviorSubject<any>({});
  private otherPeerId$ = new BehaviorSubject<any>({});
  private joinorCreate$ = new BehaviorSubject<any>({});

  prevMessagesObs$ = this.prevMessages$.asObservable();
  wsMessagesObs$ = this.wsMessages$.asObservable();
  userNameObs$ = this.userName$.asObservable();
  roomIdObs$ = this.roomId$.asObservable();
  peerIdObs$ = this.peerId$.asObservable();
  otherPeerIdObs$ = this.otherPeerId$.asObservable();
  joinorCreateObs$ = this.joinorCreate$.asObservable();

  addMessage(messageDetails: any) {
    this.prevMessages$.next(messageDetails);
  }

  shareUserName(userName: string) {
    this.userName$.next(userName);
  }

  sharePeerId(peerId: string) {
    this.peerId$.next(peerId);
  }

  shareRoomId(roomId: string, joiningType: string) {
    this.roomId$.next({ roomId: roomId, type: joiningType });
  }

  shareMessage(message: string) {
    this.wsMessages$.next(message);
  }

  shareOtherPeerId(peerId: string) {
    console.log(peerId);
    this.otherPeerId$.next(peerId);
  }

  shareRoomJoiningStatus(status: 'join' | 'create') {
    this.joinorCreate$.next(status);
  }
}
