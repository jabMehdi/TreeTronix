import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'ngx-req-code',
  templateUrl: './req-code.component.html',
  styleUrls: ['./req-code.component.scss'] ,
})

export class NgxReqCodeComponent implements OnInit {
  result :any = Math.floor(Math.random() * 1000000000);

  constructor( private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.http.post('/api/users/code',
        {
          code: this.result,
        }).subscribe(data => {
          console.log(data)
      }, error => {
        console.log(error)
      });
    console.log('code' , this.result)
  }

  reqCodetForm = new FormGroup({
    code: new FormControl(),
  });
  submitted = false;
  msg: string ;
  onSubmit() {
    this.submitted = true ;
    console.log(this.reqCodetForm.value.code)
    if(this.reqCodetForm.value.code == this.result){
      this.router.navigate(["auth" , "reset"])
    }else{
      this.msg = "code incorrect"
      console.log(this.msg)
    }
  }
  ngOnInit() {
  }
}
