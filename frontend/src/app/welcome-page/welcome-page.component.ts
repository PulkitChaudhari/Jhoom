import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/websocket.service';
import { Router } from '@angular/router';
import { DataShareService } from '../services/data.share.service';
import { PeerService } from '../services/peerjs.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
})
export class WelcomePageComponent implements OnInit {
  userName: any;
  roomId: any;
  isJoinARoomSelected: boolean = true;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private dataShareService: DataShareService,
    private peerService: PeerService
  ) {}

  ngOnInit() {
    this.messageService.initializeWebSocketConnection('hehe');
  }

  switchMeetingJoiningMode(value: boolean): void {
    this.isJoinARoomSelected = value;
  }

  joinMeeting() {
    this.dataShareService.shareUserName(this.userName);
    if (this.messageService.initializeWebSocketConnection(this.userName)) {
      this.router.navigate(['chat']);
    } else console.log('Could not connect to the server');
  }

  joinRoom() {
    const peerId = this.peerService.getPeerId();
    const userObj = {
      username: this.userName,
      peerId: peerId,
      roomId: this.roomId,
    };
    this.messageService.joinRoom(userObj);
    this.router.navigate(['chat']);
  }

  createRoom() {
    const peerId = this.peerService.getPeerId();
    const userObj = { username: this.userName, peerId: peerId };
    this.messageService.createRoom(userObj);
    this.router.navigate(['chat']);
  }
}
