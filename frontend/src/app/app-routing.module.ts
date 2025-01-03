// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { JhoomComponent } from './jhoom/jhoom.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'room/:roomId', component: JhoomComponent },
  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
