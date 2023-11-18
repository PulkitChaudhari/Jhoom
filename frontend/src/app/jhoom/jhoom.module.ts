import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JhoomComponent } from './jhoom.component';
import { ChatComponent } from '../chat/chat.component';
import { VideoComponent } from '../video/video.component';

@NgModule({
  declarations: [JhoomComponent, ChatComponent, VideoComponent],
  imports: [CommonModule],
  exports: [JhoomComponent, ChatComponent, VideoComponent],
})
export class JhoomModule {}
