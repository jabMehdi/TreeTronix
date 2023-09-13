import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  GetUserProfile = '/api/users/getProfile';
  data = {
    username: '',
    email: '',
    numTel: '',
  };
  options = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };

  constructor(private http: HttpClient, private router: Router) {}

  
  ngOnInit() {
    this.http.post(this.GetUserProfile, {}, this.options).subscribe((data: any) => {
      this.data = data;
    });
  }
  goToProfilePage() {
    // Navigate to the profile page using the router
    this.router.navigate(['auth/profile']);
}}
