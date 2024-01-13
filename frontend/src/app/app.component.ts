import { Component, OnInit } from '@angular/core';
import { PeerService } from './services/peerjs.service';
import { MessageService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private peerService : PeerService,private messageService:MessageService) {}

  ngOnInit() {
    this.messageService.initializeWebSocketConnection().then((value)=>{
      this.peerService.generatePeerId();
    },(value)=>{
      console.log("Promise rejected");
    });
  }
  
  title = 'Jhoom';

  htmlTag: HTMLElement | null;

  switchTheme() {
    this.htmlTag = document.getElementById('htmlTag');
    this.htmlTag!.className = this.htmlTag?.className == 'dark' ? '' : 'dark';
  }
}
