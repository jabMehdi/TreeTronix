import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    localStorage.clear();
  }

  loginForm: FormGroup;
  submitted = false;
  rememberMe = false;
  UserapiUrl = '/api/users/login';
  msg: string;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Check if the user's login information should be remembered
    const rememberMeValue = localStorage.getItem('rememberMe');
    if (rememberMeValue === 'true') {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (email && password) {
        this.loginForm.setValue({ email, password });
        this.rememberMe = true;
      }
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (this.rememberMe) {
        // Save the user's login information to localStorage
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        // Remove the user's login information from localStorage
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }

      // Replace this code with your actual login logic and navigation logic
      // For example:
      this.http
      .post(this.UserapiUrl, { email, password })
      .subscribe((data: any) => {
        if (data.status === 'err') {
          this.msg = 'Wrong password or email';
        } else {
          this.msg = '';
          this.router.navigate(['/pages/']);
          if (data.UserData && data.UserData.length > 0) {
            localStorage.setItem(
              'currentUser',
              JSON.stringify(data.UserData[0])
            );
            localStorage.setItem(
              'Useremail',
              JSON.stringify(data.UserData[0].email)
            );
            console.log(
              'User email: ' + JSON.stringify(data.UserData[0].email)
            );
          }
          if (data.token) {
            localStorage.setItem('token', data.token.toString());
          }
        }
      }, error => {
        console.log(error);
      });
  }
}
}