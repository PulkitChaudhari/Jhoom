import { Component, HostListener, OnInit } from '@angular/core';
import { MessageService } from '../services/websocket.service';
import { DataShareService } from '../services/data.share.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  message: string;
  userName: string;
  peerId: string;

  messages: any[] = [];

  input: any;

  constructor(
    private messageService: MessageService,
    private dataShareService: DataShareService
  ) {}

  ngOnInit(): void {
    this.dataShareService.messagesObs$.subscribe((value) => {
      console.log(value);
      this.messages.push(JSON.parse(value));
    });
    this.dataShareService.userNameObs$.subscribe((value) => {
      this.userName = value;
    });
    this.dataShareService.peerObs$.subscribe((value) => {
      this.peerId = value;
    });
  }

  sendMessage() {
    if (this.input) {
      console.log({
        message: this.input,
        userName: this.userName,
      });
      this.messageService.sendMessage({
        message: this.input,
        userName: this.userName,
      });
      this.input = '';
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}
