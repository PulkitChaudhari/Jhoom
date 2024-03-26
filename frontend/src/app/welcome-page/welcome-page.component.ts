import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/websocket.service';
import { Router } from '@angular/router';
import { DataShareService } from '../services/data.share.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
})
export class WelcomePageComponent implements OnInit {
  public userName: string = '';
  public roomId: string = '';
  public isJoinARoomSelected: boolean = true;
  public peerId: string;
  public joiningDetails = {
    userName: '',
    peerId: '',
  };

  constructor(
    private messageService: MessageService,
    private router: Router,
    private dataShareService: DataShareService
  ) {}

  ngOnInit() {
    this.dataShareService.peerIdObs$.subscribe((peerId) => {
      this.joiningDetails.peerId = peerId;
    });
  }

  switchMeetingJoiningMode(value: boolean): void {
    this.isJoinARoomSelected = value;
  }

  joinRoom() {
    this.messageService
      .joinRoom(this.joiningDetails, this.roomId)
      .subscribe((isRoomJoined) => {
        if (isRoomJoined) {
          this.messageService.getPeerIds();
          this.messageService
            .getMessages(this.roomId)
            .subscribe((messages: string) => {
              this.dataShareService.shareUserName(this.joiningDetails.userName);
              const parsedMessages: object[] = JSON.parse(messages);
              this.dataShareService.addMessage(parsedMessages);
              this.router.navigate(['chat', this.roomId]);
            });
        } else console.log('Could not join room');
      });
  }

  createRoom() {
    this.messageService.createRoom(this.joiningDetails).subscribe((roomId) => {
      if (roomId != '') {
        this.messageService.getPeerIds();
        this.dataShareService.shareUserName(this.joiningDetails.userName);
        this.dataShareService.shareRoomId(roomId);
        this.router.navigate(['chat', roomId]);
      } else console.log('Error');
    });
  }
}
