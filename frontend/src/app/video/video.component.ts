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
  private dataChannel: RTCDataChannel;

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

    this.localVideoTrack.nativeElement.srcObject = stream;
    this.rtcPeerConnection = new RTCPeerConnection(this.configuration);

    stream.getTracks().forEach((track) => {
      this.rtcPeerConnection.addTrack(track, stream);
    });

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
            else if (update.type == 'accept-offer') {
              this.userAcceptedUpdate(update.offer);
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
          });
      }
    });
  }

  userJoinedUpdate(): void {
    this.addRemoteTrack();
    this.dataChannel = this.rtcPeerConnection.createDataChannel(
      'myDataChannel',
      {
        ordered: true,
        maxRetransmits: 100,
      }
    );
    this.dataShareService.sendMessageObs$.subscribe((message: any) => {
      this.sendMessageToPeer(message);
    });
    this.sendOffer();
  }

  addRemoteTrack(): void {
    this.rtcPeerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
    };
  }

  sendOffer(): void {
    // Creating offer
    this.rtcPeerConnection.createOffer().then((offer) => {
      // Setting  offer as localDescription
      this.rtcPeerConnection.setLocalDescription(offer).then(() => {
        // sending the offer to ws
        this.messageService.sendMessage({
          type: 'send-offer',
          offer: offer,
          roomId: this.roomId,
        });
      });
    });
  }

  setAnswer(answer: any): Promise<void> {
    const remoteDescription = new RTCSessionDescription(answer);
    return this.rtcPeerConnection.setRemoteDescription(remoteDescription);
  }

  sendIceCandidate(iceCandidate: any, userName: string): void {
    this.messageService.sendMessage({
      type: 'sharing-ice-candidate',
      user: userName,
      iceCandidate: iceCandidate,
      roomId: this.roomId,
    });
  }

  setRemoteVideoTrack(): void {
    this.remoteVideoTrack.nativeElement.srcObject = this.remoteStream;
  }

  messageHandler(message: string): void {
    this.dataShareService.receiveMessage(message);
  }

  sendMessageToPeer(message: any): void {
    const toStringObj: string = JSON.stringify(message);
    this.dataChannel.send(toStringObj);
  }

  setOffer(offer: any): Promise<void> {
    return this.rtcPeerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
  }

  sendAnswer(): Promise<void> {
    // Creating answer for the offer and setting it as localdescription
    return this.rtcPeerConnection.createAnswer().then((answer) => {
      this.rtcPeerConnection.setLocalDescription(answer).then(() => {
        // sending the offer to peer.
        this.messageService.sendMessage({
          type: 'accept-offer',
          offer: answer,
          roomId: this.roomId,
        });
      });
    });
  }

  userAcceptedUpdate(answer: any): void {
    // setting answer as remotedescription
    this.setAnswer(answer).then(() => {
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
            this.rtcPeerConnection.addIceCandidate(update1.iceCandidate);
          }
        });
      // Send your ice candidates to peer
      this.rtcPeerConnection.addEventListener('icecandidate', (event) => {
        this.sendIceCandidate(event.candidate, 'user1');
      });
      // When connection state changes to connected this event will fire
      this.rtcPeerConnection.addEventListener(
        'connectionstatechange',
        (event: any) => {
          if (this.rtcPeerConnection.connectionState === 'connected') {
            this.setRemoteVideoTrack();

            this.dataChannel.addEventListener('open', (event) => {
              this.dataChannel.addEventListener('message', (event) => {
                this.messageHandler(event.data);
              });
              this.sendMessageToPeer({
                userName: 'pulkit',
                message: 'hello user2',
              });
            });
          }
        }
      );
    });
  }

  userSentOfferUpdate(offer: any): void {
    this.addRemoteTrack();
    this.setOffer(offer).then(() => {
      this.sendAnswer().then(() => {
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
              this.rtcPeerConnection.addIceCandidate(update1.iceCandidate);
            }
          });
        // send your ice candidates to peer.
        this.rtcPeerConnection.addEventListener('icecandidate', (event) => {
          if (event.candidate) {
            this.sendIceCandidate(event.candidate, 'user2');
          }
        });
        // when connectionstatechange event is fired
        this.rtcPeerConnection.addEventListener(
          'connectionstatechange',
          (event: any) => {
            if (this.rtcPeerConnection.connectionState === 'connected') {
              this.setRemoteVideoTrack();

              this.rtcPeerConnection.addEventListener(
                'datachannel',
                (event) => {
                  this.dataChannel = event.channel;
                  this.dataShareService.sendMessageObs$.subscribe(
                    (message: any) => {
                      this.sendMessageToPeer(message);
                    }
                  );
                  this.dataChannel.addEventListener('open', (event: any) => {
                    this.dataChannel.addEventListener('message', (event) => {
                      this.messageHandler(event.data);
                    });
                    this.sendMessageToPeer({
                      userName: 'pulkit',
                      message: 'hello user1',
                    });
                  });
                }
              );
            }
          }
        );
      });
    });
  }
}
