import { Component } from '@angular/core';
import { DataShareService } from '../services/data.share.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-jhoom',
  templateUrl: './jhoom.component.html',
  styleUrls: ['./jhoom.component.css'],
})
export class JhoomComponent {

  roomId: string;
  userName: string;
  peerId: string;

  constructor(
    private dataShareService: DataShareService,
  ) {}

  ngOnInit(): void {
    this.dataShareService.roomIdObs$.subscribe((value) => this.roomId = value);
    this.dataShareService.peerIdObs$.subscribe((value) => this.peerId = value);
    this.dataShareService.userNameObs$.subscribe((value) => this.userName = value);
  }
}
