import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JhoomModule } from './jhoom/jhoom.module';
import { ChatComponent } from './chat/chat.component';
import { VideoComponent } from './video/video.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, JhoomModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
