import { Component } from '@angular/core';
import { WebSocketService } from '../common/websocketservice';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  message: string;
  messages: string[] = [];

  constructor(private webSocketService: WebSocketService) {
    this.webSocketService.getMessage().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  sendMessage(): void {
    this.webSocketService.sendMessage(this.message);
    this.message = '';
  }
}
