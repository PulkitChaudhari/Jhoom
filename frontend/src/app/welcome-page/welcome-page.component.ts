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

  joinRoom() {
    const peerId = this.peerService.getPeerId();
    const userObj = {
      userName: this.userName,
      peerId: peerId,
    };
    this.messageService.joinRoom(userObj, this.roomId);
    this.router.navigate(['chat']);
    this.dataShareService.shareUserName(this.userName);
  }

  createRoom() {
    const peerId = this.peerService.getPeerId();
    const userObj = { userName: this.userName, peerId: peerId };
    this.messageService.createRoom(userObj);
    this.router.navigate(['chat']);
    this.dataShareService.shareUserName(this.userName);
    this.dataShareService.sharePeerId(peerId);
  }
}
