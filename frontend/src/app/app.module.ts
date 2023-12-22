import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JhoomModule } from './jhoom/jhoom.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataShareService } from './services/data.share.service';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  declarations: [AppComponent, WelcomePageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JhoomModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [DataShareService],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
