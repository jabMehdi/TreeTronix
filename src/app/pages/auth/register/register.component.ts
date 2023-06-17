import {Component, OnInit} from '@angular/core';

import {HttpClient} from '@angular/common/http';




import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators , FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
})
export class NgxRegisterComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router , private formBuilder: FormBuilder) {
  }

  registerForm = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    numTel: new FormControl(),
  });
test = 'ok';
  submitted = false;
  UserapiUrl = '/api/users/register';
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      numTel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
    this.http.post(this.UserapiUrl,
      {
        username: this.registerForm.get('username').value,
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
        numTel: this.registerForm.get('numTel').value,
      }).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      if (resJSON.status === 'ok') {
        this.router.navigate(['/auth/login/']);
      }


      // console.log('okddddddddddddddddddddddddddddddddddddddddddddd');
    }, error => {
    });
  }}




  get f() {
    return this.registerForm.controls;
  }
  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
}
