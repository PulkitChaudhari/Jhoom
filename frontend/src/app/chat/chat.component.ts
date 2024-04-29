import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataShareService.receiveMessageObs$.subscribe((message) => {
      message = JSON.parse(message);
      if (message?.message) {
        message.userName = 'other';
        this.messages.push(message);
        this.cd.detectChanges();
      }
    });
  }

  sendMessage() {
    if (this.input) {
      this.dataShareService.sendMessage({
        message: this.input,
      });
      this.messages.push({
        message: this.input,
        userName: 'self',
      });
      this.input = '';
    }
  }
}
