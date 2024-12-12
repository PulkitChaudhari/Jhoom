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
    if (this.roomId == '')
      this.dataShareService.shareToastMessage(
        'Please enter Room Id',
        'Room Id field cannot be blank'
      );
    else {
      this.messageService.joinRoom(this.roomId).subscribe((resp) => {
        if (resp) {
          this.dataShareService.shareRoomId(this.roomId, 'joined');
          this.router.navigate(['room', this.roomId]);
        } else
          this.dataShareService.shareToastMessage(
            'Incorrect Room Id',
            'No room is created with this Room Id, please enter correct Room Id'
          );
      });
    }
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
