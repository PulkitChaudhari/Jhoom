import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataShareService {
  private messages$ = new BehaviorSubject<any>({});
  messagesObs$ = this.messages$.asObservable();
  constructor() {}

  addMessage(message: any) {
    this.messages$.next(message);
  }
}
