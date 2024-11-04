import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataShareService } from '../services/data.share.service';
import { MessageService } from '../services/websocket.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent {
  private roomId: string = '';
  private roomJoiningStatus: 'joined' | 'created';
  private dataChannel: RTCDataChannel;
  private localOffer: any;
  private localAnswer: any;
  private isFirstIce: boolean = false;
  private rtcPeerConnection!: RTCPeerConnection;
  private remoteStream: MediaStream = new MediaStream();

  @ViewChild('localVideoTrack') localVideoTrack: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideoTrack') remoteVideoTrack: ElementRef<HTMLVideoElement>;

  constructor(
    private dataShareService: DataShareService,
    private messageService: MessageService
  ) {}

  private configuration = {
    iceServers: [
      {
        urls: 'turn:43.204.217.171:3478',
        username: 'pulkit',
        credential: 'pulkit',
      },
    ],
  };

  async ngOnInit(): Promise<void> {
    // Getting MediaStream of video and audio for local user
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // Assigning local user video and audio to html
    this.localVideoTrack.nativeElement.srcObject = stream;

    // creating new rtcpeerconnection obj
    this.rtcPeerConnection = new RTCPeerConnection(this.configuration);

    // Setting localuser's video and audio in rtcpeerconnection obj to later be accessed by remote user.
    stream.getTracks().forEach((track) => {
      this.rtcPeerConnection.addTrack(track, stream);
    });

    this.rtcPeerConnection.ontrack = (event) => {
      console.log(event);
    };

    // Waiting to get updates whether localuser has joined a room or created one
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
              this.userJoinedUpdate();
            }

            // if the peer accepts offer and sends answer
            if (update.type == 'accept-offer') {
              this.userAcceptedUpdate(update.offer);
            }

            // if update is of sharing ice candidate and is not from the same user
            // add the ice candidate
            if (
              update.type == 'sharing-ice-candidate' &&
              update.user != 'user1'
            ) {
              this.rtcPeerConnection.addIceCandidate(
                new RTCIceCandidate(update.iceCandidate)
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
              this.userSentOfferUpdate(update.offer);
            }

            // if update is of sharing ice candidate and is not from the same user
            // add the ice candidate
            if (
              update.type == 'sharing-ice-candidate' &&
              update.user != 'user2'
            ) {
              if (!this.isFirstIce) {
                this.isFirstIce = true;
                this.rtcPeerConnection
                  .setLocalDescription(this.localAnswer)
                  .then(() => {
                    this.rtcPeerConnection.addEventListener(
                      'icecandidate',
                      (event) => {
                        if (event.candidate)
                          this.sendIceCandidate(event.candidate, 'user2');
                      }
                    );
                  });
              }
              this.rtcPeerConnection.addIceCandidate(
                new RTCIceCandidate(update.iceCandidate)
              );
            }
          });
      }
    });
    this.rtcPeerConnection.addEventListener(
      'connectionstatechange',
      (event: any) => {
        if (this.rtcPeerConnection.connectionState === 'connected') {
          if (this.roomJoiningStatus === 'created') {
            this.dataShareService.sendMessageObs$.subscribe((message: any) => {
              this.sendMessageToPeer(message);
            });
            this.dataChannel.addEventListener('open', (event) => {
              this.dataChannel.addEventListener('message', (event) => {
                this.messageHandler(event.data);
              });
            });
          } else {
            this.rtcPeerConnection.addEventListener(
              'datachannel',
              (event: any) => {
                if (this.dataChannel == null) {
                  this.dataChannel = event.channel;
                  this.dataShareService.sendMessageObs$.subscribe(
                    (message: any) => {
                      this.sendMessageToPeer(message);
                    }
                  );
                  this.dataChannel.addEventListener('open', (event) => {
                    this.dataChannel.addEventListener('message', (event) => {
                      this.messageHandler(event.data);
                    });
                  });
                }
              }
            );
          }
        }
      }
    );
  }

  userJoinedUpdate(): void {
    this.dataChannel = this.rtcPeerConnection.createDataChannel(
      'myDataChannel',
      {
        ordered: true,
        maxRetransmits: 100,
      }
    );
    this.sendOffer();
  }

  addRemoteTrack(): void {
    this.rtcPeerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
      this.remoteVideoTrack.nativeElement.srcObject = this.remoteStream;
    };
  }

  sendOffer(): void {
    this.rtcPeerConnection.createOffer().then((offer) => {
      this.localOffer = offer;
      this.messageService.sendMessage({
        type: 'send-offer',
        offer: offer,
        roomId: this.roomId,
      });
    });
  }

  sendIceCandidate(iceCandidate: any, userName: string): void {
    this.messageService.sendMessage({
      type: 'sharing-ice-candidate',
      user: userName,
      iceCandidate: iceCandidate,
      roomId: this.roomId,
    });
  }

  messageHandler(message: string): void {
    this.dataShareService.receiveMessage(message);
  }

  sendMessageToPeer(message: any): void {
    if (this.dataChannel.readyState == 'open') {
      const toStringObj: string = JSON.stringify(message);
      this.dataChannel.send(toStringObj);
    }
  }

  sendAnswer(): void {
    this.rtcPeerConnection.createAnswer().then((answer) => {
      this.localAnswer = answer;
      this.messageService.sendMessage({
        type: 'accept-offer',
        offer: answer,
        roomId: this.roomId,
      });
    });
  }

  userAcceptedUpdate(answer: any): void {
    this.localAnswer = answer;
    this.rtcPeerConnection.setLocalDescription(this.localOffer).then(() => {
      this.rtcPeerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate) this.sendIceCandidate(event.candidate, 'user1');
      });
      this.addRemoteTrack();
      this.rtcPeerConnection
        .setRemoteDescription(this.localAnswer)
        .then(() => {});
    });
  }

  userSentOfferUpdate(offer: any): void {
    this.localOffer = offer;
    this.addRemoteTrack();
    this.rtcPeerConnection.setRemoteDescription(offer).then(() => {
      this.sendAnswer();
    });
  }
}
