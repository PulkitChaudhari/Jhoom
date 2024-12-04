import { Component, OnInit } from '@angular/core';
import { MessageService } from './services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private messageService: MessageService, private router: Router) {}

  ngOnInit() {
    this.messageService.initializeWebSocketConnection().then(
      (value) => {
        console.log('Websocket connected');
      },
      (value) => {
        console.log('Promise rejected');
      }
    );
  }

  title = 'Jhoom';

  htmlTag: HTMLElement | null;

  switchTheme() {
    this.htmlTag = document.getElementById('htmlTag');
    this.htmlTag!.className = this.htmlTag?.className == 'dark' ? '' : 'dark';
  }

  navigateToWelcomePage() {
    this.router.navigate(['welcome']);
  }
}
