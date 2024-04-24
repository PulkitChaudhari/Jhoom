import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/websocket.service';
import { DataShareService } from '../services/data.share.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  message: string;
  userName: string;
  roomId: string | null;
  peerId: string;

  messages: any[] = [];

  input: any;

  constructor(
    private messageService: MessageService,
    private dataShareService: DataShareService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataShareService.prevMessagesObs$.subscribe(
      (value) => (this.messages = value)
    );
    this.messageService.fetchWSMessages();
    this.dataShareService.userNameObs$.subscribe(
      (value) => (this.userName = value)
    );
    this.route.paramMap.subscribe(
      (params: ParamMap) => (this.roomId = params.get('roomId'))
    );
    this.dataShareService.wsMessagesObs$.subscribe((msg: any) => {
      if (Object.keys(msg).length !== 0) {
        this.messages.push(JSON.parse(msg.body));
      }
    });
  }

  sendMessage() {
    if (this.input) {
      this.messageService.sendMessage({
        type: 'chat-message',
        userName: this.userName,
        roomId: this.roomId,
        message: this.input,
      });
      this.input = '';
    }
  }
}
