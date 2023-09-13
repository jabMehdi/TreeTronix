import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

import {Factory} from '../../model/factory';

const Swal = require('sweetalert2');

@Component({
  selector: 'ngx-allfactory',
  templateUrl: './allfactory.component.html',
  styleUrls: ['./allfactory.component.scss'],
})
export class AllfactoryComponent {

  constructor(private http: HttpClient) {
  }

  settings = {
    add: {
      addButtonContent: '<i class=""></i>',
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
      name: {
        title: 'name',
        type: 'string',
      },
      description: {
        title: 'description',
        type: 'string',
      },
      nbrSensor: {
        title: 'Device Number',
        type: 'string',
      },
      lat: {
        title: 'coordinators (Lattitude )',
        type: 'string',
      },
      lng: {
        title: 'coordinators (Longitude)',
        type: 'string',
      },
    },
  };
  options = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  public data: Array<Factory>;
  public data1;
  ok = this.http.post('/api/Factories/factory/ByUser',
    {}, this.options).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.data = resJSON;
    this.data.forEach(item => {
      item.nbrSensor = item.sensorsId.length;
    });
    this.data1 = this.data;
  });
  

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
        this.http.delete('/api/factories/factory/delete/' + event.data._id).subscribe(
          data=>{
            console.log("result from delete: "+data);
            if (data=="success"){
              Swal.fire(
                'Deleted!',
                'Your factory has been deleted.',
                'success',
              );

            }
            else{
              Swal.fire(
                'Oups!',
                'Error while trying to delete factory',
                'Error while trying to delete factory',
              );

            }
          }
        );
        event.confirm.resolve();
     
      }
    });
  }
  onEditConfirm(event): void {
    this.http.post('/api/factories/factory/update/',
      {
        id: event.newData._id,
        name: event.newData.name ,
        description : event.newData.description ,
      }, this.options).subscribe(
      res => {
        event.confirm.resolve(event.newData);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your factory information has been updated',
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
