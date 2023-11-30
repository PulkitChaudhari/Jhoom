import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JhoomModule } from './jhoom/jhoom.module';
import { ChatComponent } from './chat/chat.component';
import { VideoComponent } from './video/video.component';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { DataShareService } from './Data Share Service/data.share.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JhoomModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
  ],
  providers: [DataShareService],
  bootstrap: [AppComponent],
})
export class AppModule {}
