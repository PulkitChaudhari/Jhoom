import { Component } from '@angular/core';

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
