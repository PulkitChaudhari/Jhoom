import { Component, ElementRef, ViewChild } from '@angular/core';
import { PeerService } from '../services/peerjs.service';
import { DataShareService } from '../services/data.share.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent {
  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;

  constructor(
    private peerService: PeerService,
    private dataShareService: DataShareService
  ) {}

  ngOnInit(): void {
    const peer = this.peerService.getPeer();

    this.dataShareService.peerIdObs$.subscribe((value) => {});

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localVideo.nativeElement.srcObject = stream;

        // Connect to a peer and send the stream
        const call = peer.call('remote-peer-id', stream);

        // Handle incoming stream
        peer.on('call', (incomingCall) => {
          incomingCall.answer(stream);
          incomingCall.on('stream', (remoteStream) => {
            this.remoteVideo.nativeElement.srcObject = remoteStream;
          });
        });
      })
      .catch((error) => console.error('getUserMedia error:', error));
  }
}
