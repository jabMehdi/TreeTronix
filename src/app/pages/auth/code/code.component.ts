/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component , OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { FormBuilder, FormGroup, Validators , FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  templateUrl: './code.component.html',
})
export  class CodeComponent implements OnInit {
  constructor( private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
  }

  codeForm = new FormGroup({
    email: new FormControl(),
  });
  submitted = false;
  msg: string ;
  onSubmit() {
    this.submitted = true ;
    if (this.codeForm.valid) {
      this.http.post('api/users/code',
        {
          code: this.codeForm.get('code').value,
        }).subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        if (resJSON.status === 'err') {
          this.msg = 'wrong code';
        } else {
          this.msg = '' ;
          this.router.navigate(['/auth/login']);
        }
      }, error => {
      });
    }}
  ngOnInit() {
    this.codeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
