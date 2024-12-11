import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from './services/websocket.service';
import { Router } from '@angular/router';
import { DataShareService } from './services/data.share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  showToast: boolean = false;

  title = 'Jhoom';

  toasts: { title: string; message: string; show: boolean }[] = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private dataShareService: DataShareService
  ) {}

  ngOnInit() {
    this.messageService.initializeWebSocketConnection().then(
      (value) => {
        console.log('Websocket connected');
      },
      (value) => {
        console.log('Promise rejected');
      }
    );
    this.dataShareService.showToastObs$.subscribe((toast) => {
      if (toast?.title !== undefined) this.addToast(toast);
    });
  }

  navigateToWelcomePage() {
    this.router.navigate(['welcome']);
  }

  addToast(toast: any) {
    this.toasts.push(toast);
    setTimeout(() => (toast.show = true), 100);
  }

  removeToast(index: number) {
    this.toasts[index].show = false;
    setTimeout(() => this.toasts.splice(index, 1), 0);
  }

  ngOnDestroy() {}
}
