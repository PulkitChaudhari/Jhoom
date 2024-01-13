// peer.service.ts
import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataShareService } from './data.share.service';

@Injectable({
  providedIn: 'root',
})
export class PeerService {

  private peer: Peer;

  constructor(private dataShareService : DataShareService) {
    this.peer = new Peer();
  }

  generatePeerId() : Number {
    this.peer.on('open', (id) => {
      console.log("My peerId is : " + id );
      this.dataShareService.sharePeerId(id);
      return 0;
    });
    this.peer.on('error', (err) => {
      return 1;
    })
    return 2;
  }

  getPeer(): Peer {
    return this.peer;
  }
}
