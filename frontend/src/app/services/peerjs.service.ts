// peer.service.ts
import { Injectable } from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  private peer: Peer;
  private peerId: string;

  constructor() {
    this.peer = new Peer(); // You can pass options here if needed

    this.peer.on('open', (id) => {
      this.peerId = id;
      console.log('My peer ID is: ' + id);
    });

    // this.peer.on('error', (err) => {
    //   console.error(err);
    // });
  }

  getPeer(): Peer {
    return this.peer;
  }

  getPeerId(): string {
    return this.peerId;
  }

  // Implement methods to connect, send and receive data, etc.
}
