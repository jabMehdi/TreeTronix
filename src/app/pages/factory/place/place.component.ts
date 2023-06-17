import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {Factory} from '../../model/factory';
import {Router} from '@angular/router';

const Swal = require('sweetalert2');

@Component({
  selector: 'ngx-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
})
export class PlaceComponent {

  constructor(private http: HttpClient ,  private router: Router) {
  }

  selectedOption: any;
  addForm = new FormGroup({
    place: new FormControl(),
  });
  option = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  findFactoryByuser = '/api/Factories/factory/ByUser';
  options = [];
  test = this.http.post(this.findFactoryByuser, {},
    this.option).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.options = resJSON;
  });

  onSubmit() {
    this.http.post('/api/factories/factory/addPlace/',
      {
        place: this.addForm.get('place').value,
        id: this.selectedOption._id,
      }, this.option).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      if (resJSON.status === 'err') {
        Swal.fire(
          'error!',
          'Wrong information',
          'error',
        );
      } else {
        Swal.fire(
          'Success!',
          'Your zone has been added to the factory.',
          'success',
        );
        this.router.navigate(['/pages/addsensor']);

      }
    }, error => {
    });
    this.addForm.reset();

  }

  settings = {
    add: {
      addButtonContent: '<i class=""></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },  delete: {
      deleteButtonContent: '<i class="nb-trash" hidden></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },

    columns: {
      name: {
        title: 'name',
        type: 'string',
      },
      place: {
        title: 'Zone',
        type: 'string',
      },
    },
  };
  opt = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  public data: Array<Factory>;
  public data1;
  ok = this.http.post('/api/Factories/factory/ByUser',
    {}, this.opt).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.data = resJSON;
    this.data1 = this.data;
  });
  onEditConfirm(event): void {
    this.http.post('/api/factories/factory/updateZone/',
      {
        id: event.newData._id,
        name: event.newData.name ,
        place : event.newData.place ,
      }, this.opt).subscribe(
      res => {
        event.confirm.resolve(event.newData);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your zone information has been updated',
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
