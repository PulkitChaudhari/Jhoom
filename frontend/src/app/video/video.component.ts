import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataShareService } from '../services/data.share.service';
import { MessageService } from '../services/websocket.service';
import { environment } from '../environment/environment';

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
        urls: environment.turnServerUrl,
        username: environment.turnUsername,
        credential: environment.turnPassword,
      },
    ],
  };

  async ngOnInit(): Promise<void> {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.localVideoTrack.nativeElement.srcObject = stream;
    this.rtcPeerConnection = new RTCPeerConnection(this.configuration);
    stream.getTracks().forEach((track) => {
      this.rtcPeerConnection.addTrack(track, stream);
    });
    this.dataShareService.roomIdObs$.subscribe((obj) => {
      this.roomJoiningStatus = obj.type;
      this.roomId = obj.roomId;
      window.addEventListener('beforeunload', (event) => {
        console.log('before unload event fired');
        this.messageService.sendMessage({
          roomId: this.roomId,
          type: 'left',
        });
      });
      if (this.roomJoiningStatus == 'created') {
        this.roomCreatorRTC(stream);
      } else {
        this.roomJoinerRTC(stream);
      }
    });
    this.addConnectedEventListener();
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

  userLeftTheRoom(user: string) {}

  calltoastMessage(message: string) {}

  getvideoinfo() {
    console.log(this.remoteVideoTrack.nativeElement.srcObject);
  }

  roomCreatorRTC(stream: MediaStream) {
    this.messageService
      .getRoomUpdates()
      .subscribe('/room/update/' + this.roomId, async (update: any) => {
        update = JSON.parse(update.body);

        if (update.type == 'left') {
          this.dataShareService.shareToastMessage(
            'Left',
            'user has left the room'
          );
          this.userLeftTheRoom(
            this.roomJoiningStatus == 'created' ? 'creator' : 'joiner'
          );

          this.rtcPeerConnection.close();

          this.remoteVideoTrack.nativeElement.srcObject = null;

          this.remoteStream = new MediaStream();

          // creating new rtcpeerconnection obj
          this.rtcPeerConnection = new RTCPeerConnection(this.configuration);

          // Setting localuser's video and audio in rtcpeerconnection obj to later be accessed by remote user.
          stream.getTracks().forEach((track) => {
            this.rtcPeerConnection.addTrack(track, stream);
          });
        }

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
        if (update.type == 'sharing-ice-candidate' && update.user != 'user1') {
          this.rtcPeerConnection.addIceCandidate(
            new RTCIceCandidate(update.iceCandidate)
          );
        }
      });
  }

  roomJoinerRTC(stream: MediaStream) {
    // sending message to ws that u have joined
    this.messageService.sendMessage({
      type: 'joined',
      roomId: this.roomId,
    });
    this.messageService
      .getRoomUpdates()
      .subscribe('/room/update/' + this.roomId, async (update: any) => {
        update = JSON.parse(update.body);

        if (update.type == 'left') {
          this.dataShareService.shareToastMessage(
            'Left',
            'user has left the room'
          );
          this.userLeftTheRoom(
            this.roomJoiningStatus == 'created' ? 'creator' : 'joiner'
          );
          this.rtcPeerConnection.close();

          this.remoteVideoTrack.nativeElement.srcObject = null;

          this.remoteStream = new MediaStream();

          // creating new rtcpeerconnection obj
          this.rtcPeerConnection = new RTCPeerConnection(this.configuration);

          // Setting localuser's video and audio in rtcpeerconnection obj to later be accessed by remote user.
          stream.getTracks().forEach((track) => {
            this.rtcPeerConnection.addTrack(track, stream);
          });
        }

        // if update is of offer being sent
        if (update.type == 'send-offer') {
          this.userSentOfferUpdate(update.offer);
        }

        // if update is of sharing ice candidate and is not from the same user
        // add the ice candidate
        if (update.type == 'sharing-ice-candidate' && update.user != 'user2') {
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

  addConnectedEventListener() {
    this.rtcPeerConnection.addEventListener(
      'connectionstatechange',
      (event: any) => {
        if (this.rtcPeerConnection.connectionState === 'connected') {
          this.calltoastMessage(
            'Another user has successfully joined the room'
          );
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
}
