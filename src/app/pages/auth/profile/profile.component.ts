import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../model/User';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

const Swal = require('sweetalert2');
@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
 GetProfile = '/api/users/getProfile';
  data = new User ;
  options = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };

constructor(private http: HttpClient, private router: Router , private formBuilder: FormBuilder) {
  this.http.post(this.GetProfile,
    {}, this.options).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.data = resJSON;
  });
}

registerForm = new FormGroup({
  username: new FormControl(),
  email: new FormControl(),
  password: new FormControl(),
  numTel: new FormControl(),
});
test = 'ok';
submitted = false;
UserapiUrl = 'api/users/update';
ngOnInit() {
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
      }, this.options).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      if (resJSON.status === 'err') {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Please write information',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Profile Updated ',
          showConfirmButton: false,
          timer: 1500,
        });
      }
        this.router.navigate(['./pages/iot-dashboard']);
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
