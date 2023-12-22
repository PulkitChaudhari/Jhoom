import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../model/MessageModel';

@Injectable()
export class DataShareService {
  // Declaring a new behaviorSubject
  private messages$ = new BehaviorSubject<any>({});
  private userName$ = new BehaviorSubject<any>({});
  private peer$ = new BehaviorSubject<any>({});

  messagesObs$ = this.messages$.asObservable();
  userNameObs$ = this.userName$.asObservable();
  peerObs$ = this.peer$.asObservable();

  addMessage(message: string) {
    this.messages$.next(message);
  }

  shareUserName(userName: string) {
    this.userName$.next(userName);
  }

  sharePeerId(peerId: string) {
    this.peer$.next(peerId);
  }
}
