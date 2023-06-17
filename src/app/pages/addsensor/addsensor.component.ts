import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../auth/model/User';
import {Router} from '@angular/router';

const Swal = require('sweetalert2');



@Component({
  selector: 'ngx-addsensor',
  templateUrl: './addsensor.component.html',
  styleUrls: ['./addsensor.component.scss'],
})
export class AddsensorComponent implements OnInit {

  SensorForm = new FormGroup({
    code: new FormControl(),
    F: new FormControl(),
    name : new FormControl(),
    area : new FormControl(),
  });
  submitted = false;

  SenspiUrl = '/api/sensors/sensor/findByCode';
  UpdateUrl = '/api/sensors/sensor/updateSensor/';
  findFactoryByuser = '/api/Factories/factory/ByUser';

  constructor(private http: HttpClient ,  private router: Router) {
  }

  CurrentUser = new User();


  ngOnInit() {
    // this.CurrentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  option = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  options = [];
  options2 = [];
  test = this.http.post(this.findFactoryByuser, {},
    this.option).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.options = resJSON;
  });
  selectedOption;

  selectedOption2;
  places: {};

  msg: string;
  check: boolean = true;

  update() {
    this.submitted = true;
    this.http.post('/api/sensors/sensor/updateSensor/',
      {
        name : this.SensorForm.get('name').value,
        area : this.selectedOption2 ,

      code: this.SensorForm.get('code').value,
        factoryId: this.selectedOption,
        isAffected: true,
      }, this.option).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      console.log(resJSON)
      if (resJSON.status === 'err') {
        Swal.fire(
        'error!',
          'Wrong Code or Device Already Used',
          'error',
          );
        } else {
          this.msg = '';
          Swal.fire(
            'Success!',
            'Your device has been added.',
            'success',
          );
        this.router.navigate(['/pages/iot-dashboard']);

        }
    }, error => {
    });
    this.SensorForm.reset();

  }


  checkCode() {
    this.submitted = true;
    this.http.post(this.SenspiUrl,
      {
        code: this.SensorForm.get('code').value,
      }, this.option).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      if (resJSON.status === 'err') {
        this.msg = 'wrong code or sensor not found';
        this.check = false;
      } else {
        this.check = true;
        this.msg = '';
      }
    }, error => {
    });
    this.SensorForm.reset();
    this.submitted = false;
  }
place() {
 // this.selectedOption = null ;
  //  this.places = null ;
   this.http.post('/api/Factories/factory/placeByFactory', {id : this.selectedOption},
    this.option).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.options2 = resJSON;
     this.places = this.options2[0].place ;
   // console.log(' click place'  , this.options2[0].place);

  });
}
  onSubmit() {
    this.update() ;

  }
}

