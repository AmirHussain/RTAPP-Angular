import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { AppComponent } from './app.component';

const routes: Routes = [

  {
    path: 'chat',
    component: ChatComponent,
    canActivate: []
  },{
    path: '',
    component: LoginComponent,
    canActivate: []
  },
  {
    path: '**',
    component: AppComponent,
    canActivate: []
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
