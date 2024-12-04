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
    this.messageService.joinRoom(this.roomId).subscribe((resp) => {
      if (resp) {
        this.dataShareService.shareRoomId(this.roomId, 'joined');
        this.router.navigate(['room', this.roomId]);
      }
    });
  }

  createRoom() {
    this.messageService.createRoom().subscribe((roomId) => {
      if (roomId) {
        this.dataShareService.shareRoomId(roomId, 'created');
        this.router.navigate(['room', roomId]);
      }
    });
  }

  toastButtonTest() {}
}
