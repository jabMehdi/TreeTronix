import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import {NbAuthModule, NbRegisterComponent} from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';

import { NgxLoginComponent } from './login/login.component';
import {NgxRegisterComponent} from './register/register.component';
import {NgxResetPasswordComponent} from './reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import {NgxRequestPasswordComponent} from './request-password/request-password.component';
import {CodeComponent} from './code/code.component';
import { NgxReqCodeComponent } from './req-code/req-code.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NbAlertModule,
        NbInputModule,
        NbButtonModule,
        NbCheckboxModule,
        NgxAuthRoutingModule,
        NbAuthModule,
        ReactiveFormsModule,
    ],
  declarations: [
    NgxLoginComponent, // <---
    NgxRegisterComponent,
    NgxResetPasswordComponent,
    ProfileComponent,
    NgxRequestPasswordComponent ,
    CodeComponent,
    NgxReqCodeComponent ,
      ],
})
export class NgxAuthModule {
}
