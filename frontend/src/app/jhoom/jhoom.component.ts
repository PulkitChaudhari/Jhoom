import { Component } from '@angular/core';
import { DataShareService } from '../services/data.share.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jhoom',
  templateUrl: './jhoom.component.html',
  styleUrls: ['./jhoom.component.css'],
})
export class JhoomComponent {
  roomId: string;
  userName: string;
  peerId: string;
  url = 'http://localhost:8082/getUsers/';
  peers: any;

  ngOnInit(): void {
    this.dataShareService.roomIdObs$.subscribe((value) => {
      this.roomId = value;
      console.log(value);
      // console.log(this.url + this.roomId);
      // this.http.get(this.url + this.roomId).subscribe((array) => {
      //   this.peers = array;
      //   console.log(array);
      // });
    });

    this.dataShareService.peerIdObs$.subscribe((value) => {
      this.peerId = value;
    });

    this.dataShareService.userNameObs$.subscribe((value) => {
      this.userName = value;
    });
  }

  constructor(
    private dataShareService: DataShareService,
    private http: HttpClient
  ) {}
}
