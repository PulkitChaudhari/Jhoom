import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataShareService } from '../services/data.share.service';
import { MessageService } from '../services/websocket.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent {
  private roomId: string = '';
  private roomJoiningStatus: 'joined' | 'created';

  @ViewChild('localVideoTrack') localVideoTrack: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideoTrack') remoteVideoTrack: ElementRef<HTMLVideoElement>;

  private remoteStream: MediaStream = new MediaStream();

  constructor(
    private dataShareService: DataShareService,
    private messageService: MessageService
  ) {}

  private configuration = {
    iceServers: [
      {
        urls: 'turn:127.0.0.1',
        username: 'pulkit',
        credential: 'pulkit',
      },
    ],
  };

  private rtcPeerConnection: RTCPeerConnection;

  async ngOnInit(): Promise<void> {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    // MediaStream
    this.localVideoTrack.nativeElement.srcObject = stream;
    this.rtcPeerConnection = new RTCPeerConnection(this.configuration);

    this.dataShareService.roomIdObs$.subscribe((obj) => {
      this.roomJoiningStatus = obj.type;
      this.roomId = obj.roomId;

      // If the room was created
      if (this.roomJoiningStatus == 'created') {
        this.messageService
          .getRoomUpdates()
          .subscribe('/room/update/' + this.roomId, async (update: any) => {
            update = JSON.parse(update.body);

            // When a user joins
            if (update.type == 'joined') {
              stream.getTracks().forEach((track) => {
                this.rtcPeerConnection.addTrack(track, stream);
              });

              this.rtcPeerConnection.ontrack = (event) => {
                console.log(event);
                event.streams[0].getTracks().forEach((track) => {
                  this.remoteStream.addTrack(track);
                });
              };

              this.rtcPeerConnection.createDataChannel('myDataChannel', {
                ordered: true,
                maxRetransmits: 100,
              });

              // Creating offer
              const offer = await this.rtcPeerConnection.createOffer();

              // Setting  offer as localDescription
              await this.rtcPeerConnection.setLocalDescription(offer);

              // sending the offer to ws
              this.messageService.sendMessage({
                type: 'send-offer',
                offer: offer,
                roomId: this.roomId,
              });
            }

            // if the peer accepts offer and sends answer
            else if (update.type == 'accept-offer') {
              // setting answer as remotedescription
              const remoteDescription = new RTCSessionDescription(update.offer);
              await this.rtcPeerConnection.setRemoteDescription(
                remoteDescription
              );

              // ice logic
              this.messageService
                .getRoomUpdates()
                .subscribe('/room/update/' + this.roomId, (update1: any) => {
                  update1 = JSON.parse(update1.body);

                  // if update is of sharing ice candidate and is not from the same user
                  // add the ice candidate
                  if (
                    update1.type == 'sharing-ice-candidate' &&
                    update1.user != 'user1'
                  ) {
                    this.rtcPeerConnection.addIceCandidate(
                      update1.iceCandidate
                    );
                  }
                });

              // Send your ice candidates to peer
              this.rtcPeerConnection.addEventListener(
                'icecandidate',
                (event) => {
                  if (event.candidate) {
                    this.messageService.sendMessage({
                      type: 'sharing-ice-candidate',
                      user: 'user1',
                      iceCandidate: event.candidate,
                      roomId: this.roomId,
                    });
                  }
                }
              );

              // When connection state changes to connected this event will fire
              this.rtcPeerConnection.addEventListener(
                'connectionstatechange',
                (event: any) => {
                  if (this.rtcPeerConnection.connectionState === 'connected') {
                    console.log('Connected ', event);
                    // Do something with the remote tracks, like adding them to a <video> element
                    this.remoteVideoTrack.nativeElement.srcObject =
                      this.remoteStream;
                  }
                }
              );
            }
          });
      } else {
        // sending message to ws that u have joined
        this.messageService.sendMessage({
          type: 'joined',
          roomId: this.roomId,
        });
        this.messageService
          .getRoomUpdates()
          .subscribe('/room/update/' + this.roomId, async (update: any) => {
            update = JSON.parse(update.body);

            // if update is of offer being sent
            if (update.type == 'send-offer') {
              stream.getTracks().forEach((track) => {
                this.rtcPeerConnection.addTrack(track, stream);
              });

              this.rtcPeerConnection.ontrack = (event) => {
                console.log(event);
                event.streams[0].getTracks().forEach((track) => {
                  this.remoteStream.addTrack(track);
                });
              };

              await this.rtcPeerConnection.setRemoteDescription(
                new RTCSessionDescription(update.offer)
              );

              // Creating answer for the offer and setting it as localdescription
              const answer = await this.rtcPeerConnection.createAnswer();
              await this.rtcPeerConnection.setLocalDescription(answer);

              // sending the offer to peer.
              this.messageService.sendMessage({
                type: 'accept-offer',
                offer: answer,
                roomId: this.roomId,
              });

              // ice logic
              this.messageService
                .getRoomUpdates()
                .subscribe('/room/update/' + this.roomId, (update1: any) => {
                  // if update is of sharing ice candidate and is not from the same user
                  // add the ice candidate
                  update1 = JSON.parse(update1.body);
                  if (
                    update1.type == 'sharing-ice-candidate' &&
                    update1.user != 'user2'
                  ) {
                    this.rtcPeerConnection.addIceCandidate(
                      update1.iceCandidate
                    );
                  }
                });

              // send your ice candidates to peer.
              this.rtcPeerConnection.addEventListener(
                'icecandidate',
                (event) => {
                  if (event.candidate) {
                    this.messageService.sendMessage({
                      type: 'sharing-ice-candidate',
                      user: 'user2',
                      iceCandidate: event.candidate,
                      roomId: this.roomId,
                    });
                  }
                }
              );

              // when connectionstatechange event is fired
              this.rtcPeerConnection.addEventListener(
                'connectionstatechange',
                (event: any) => {
                  if (this.rtcPeerConnection.connectionState === 'connected') {
                    console.log('Connected ', event);
                    // Do something with the remote tracks, like adding them to a <video> element
                    this.remoteVideoTrack.nativeElement.srcObject =
                      this.remoteStream;
                  }
                }
              );
            }
          });
      }
    });
  }

  async addMediaStreams(): Promise<void> {}
}
