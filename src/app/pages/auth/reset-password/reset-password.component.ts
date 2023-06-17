import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { __values } from 'tslib';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './reset-password.component.html',
})
export  class NgxResetPasswordComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  resetPassForm = new FormGroup({
    password: new FormControl(),
    rePass:new FormControl()
  });
  ngOnInit(): void {
      
  }
  resetPass(form : NgForm){
    console.log(form.value)
    const email = localStorage.getItem("email")
    if(form.value.password == form.value.rePass){
      this.http.put('/api/users/newPassword',
      {
        password: form.value.password,
        email : email
      }).subscribe(data => {
        localStorage.clear()
        console.log(data)
        this.router.navigate(['/auth/login/']);
    }, error => {
      console.log(error)
    });
    }else{
      console.log('password conform invalid')
    }
  }

}

