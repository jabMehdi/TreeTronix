
import {Component} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {NbComponentStatus} from '@nebular/theme';
export declare type NbData = 'Humidity' | 'Temperature' | 'Light' | 'Energy';
const Swal = require('sweetalert2');
@Component({
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class NgxAlertComponent {
  selectedOption ;
  email;
  constructor(private http: HttpClient ) {
              this.email = localStorage.getItem("Useremail");
console.log("user email: "+this.email)  }

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus" hidden></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      deviceName: {
        title: ' Device',
      },
      min: {
        title: ' Minimum values',
      },
      max: {
        title: 'Maximum values',
      },
      data: {
        title: 'target',
      },
      status: {
        title: 'status',
      },
      Nsms: {
        title: 'with sms',

      },
      Nemail: {
        title: 'with email',

      },
      Ntoast: {
        title: 'with toast',

      },

    },
  };
  all ;
   Vmin;
   Vmax ;
   Nemail = false ;
   Nsms = false ;
   Ntoast = true ;
  typesData: NbData[] = ['Humidity', 'Temperature', 'Light' , 'Energy'] ;
  data: NbData = 'Humidity' ;
  status: NbComponentStatus = 'info';
  types: NbComponentStatus[] = [
    'info',
    'warning',
    'danger',
  ];
  option = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  options = [];
  ok  = this.http.post('/api/sensors/sensor/findByType', {type : ['Sensor','AN-303','AN-302','AN-305A','AN-301','AN-103A']},
    this.option).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.options = resJSON ; }) ;
  dt = this.http.get('/api/alerts/alert/getByUser',
    this.option).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.dt = resJSON ; 
  console.log('dt!!! '+this.dt)});
  onDeleteConfirm(event): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won"t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.http.delete('/api/alerts/alert/delete/' + event.data._id).subscribe();
        event.confirm.resolve ();
        Swal.fire(
          'Deleted!',
          'Your alert has been deleted.',
          'success',
        );
      }
    });

    }
  submit() {
  //  this.selectedOption = this.options[0] ;

     this.http.post('/api/Alerts/alert/add', {
	email:this.email.substr(1,this.email.length-2),
       device : this.selectedOption ,
       data : this.data ,
       Vmax : this.Vmax ,
       Vmin : this.Vmin ,
         status : this.status ,
        Nsms : this.Nsms ,
       Nemail : this.Nemail ,
       Ntoast : this.Ntoast ,
       },
      this.option).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);

       if (resJSON.status === 'err') {
         Swal.fire({
           position: 'center',
           icon: 'error',
           title: 'Bad information ',
           showConfirmButton: false,
           timer: 1500,
         });
       } else {
         Swal.fire({
           position: 'center',
           icon: 'success',
           title: 'Alert added To DB',
           showConfirmButton: false,
           timer: 1500,
         });

       }
     }, error => {
     });/*
console.log("delete alert")
 this.http.post('/api/Alerts/alert/delete/', {
             },
      this.option).subscribe(data => {
console.log("deleteeeeeed!ss"+data)})*/

  }
  onEditConfirm(event): void {
    this.http.post('/api/alerts/alert/update/',
      {
        id: event.newData._id,
        min: event.newData.min ,
        max : event.newData.max ,
        status : event.newData.status ,
      }, this.option).subscribe(
      res => {
        event.confirm.resolve(event.newData);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your device has been updated',
          showConfirmButton: false,
          timer: 1500 ,
        }) ;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
        } else {
        }
      });
  }

}
