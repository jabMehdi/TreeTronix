/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./request-password.component.html",
})
export class NgxRequestPasswordComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  requestForm = new FormGroup({
    email: new FormControl(),
  });
  submitted = false;
  msg: string;

  onSubmit() {
    this.submitted = true;
    console.log(this.requestForm.get("email").value)
    if (this.requestForm.valid) {
      localStorage.setItem("email" , this.requestForm.get("email").value)
      this.http
        .post("http://localhost:3007/api/users/request/validemail", {
          email: this.requestForm.get("email").value,
        })
        .subscribe((data) => {
          
          console.log("888888888" , data);
          const resSTR = JSON.stringify(data);
          const resJSON = JSON.parse(resSTR);
          if (resJSON.status === "err") {
            this.msg = "wrong email";
          } else {
            this.msg = "email corerrect";
            this.router.navigate(["auth" , "reqCode"])

          }
        });
    }
  }
  ngOnInit() {
    this.requestForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
}
