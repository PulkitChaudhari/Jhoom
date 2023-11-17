import { Component } from '@angular/core';

@Component({
  selector: 'app-jhoom',
  templateUrl: './jhoom.component.html',
  styleUrls: ['./jhoom.component.css'],
})
export class JhoomComponent {
  JhoomComponent() {}

  htmlTag: HTMLElement | null;

  switchTheme() {
    this.htmlTag = document.getElementById('htmlTag');
    this.htmlTag!.className = this.htmlTag?.className == 'dark' ? '' : 'dark';
  }
}
