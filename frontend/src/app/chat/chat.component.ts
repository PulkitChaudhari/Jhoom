import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../common/websocket.service';
import { DataShareService } from '../Data Share Service/data.share.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  message: string;
  messages: any[] = ['hello1', 'hello2', 'hell3', 'hello4'];
  input: any;

  constructor(
    private messageService: MessageService,
    private dataShareService: DataShareService
  ) {}

  ngOnInit(): void {
    this.dataShareService.messagesObs$.subscribe((value) => {
      console.log(value);
      this.messages.push(value.body);
    });
  }

  sendMessage() {
    if (this.input) {
      this.messageService.sendMessage(this.input);
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
