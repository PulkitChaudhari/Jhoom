import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private socket: Socket) {}

  sendMessage(message: string): void {
    this.socket.emit('chat', { content: message });
  }

  getMessage(): Observable<any> {
    return this.socket.fromEvent('messages');
  }
}
