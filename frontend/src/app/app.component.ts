import { Component } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Jhoom';

  htmlTag: HTMLElement | null;

  switchTheme() {
    this.htmlTag = document.getElementById('htmlTag');
    this.htmlTag!.className = this.htmlTag?.className == 'dark' ? '' : 'dark';
  }
}
