import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';

import { NgxLoginComponent } from './login/login.component'; // <---

import { NgxRegisterComponent } from './register/register.component';
import {NgxResetPasswordComponent} from './reset-password/reset-password.component';
import {ProfileComponent} from './profile/profile.component';
import {NgxRequestPasswordComponent} from './request-password/request-password.component';
import {NgxReqCodeComponent} from './req-code/req-code.component';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: NgxLoginComponent, // <---
      },
      {
        path: 'register',
        component: NgxRegisterComponent, // <---
      },
      {
        path: 'reset',
        component: NgxResetPasswordComponent, // <---
      },
      {
        path: 'profile',
        component: ProfileComponent, // <---
      },
      {
        path: 'request',
        component: NgxRequestPasswordComponent, // <---
      }, {
        path: 'reqCode',
        component: NgxReqCodeComponent, // <---
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}
