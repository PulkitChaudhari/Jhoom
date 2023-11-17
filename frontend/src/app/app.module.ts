import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JhoomModule } from './jhoom/jhoom.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, JhoomModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
