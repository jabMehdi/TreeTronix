import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService} from '@nebular/theme';
import {ToasterConfig} from 'angular2-toaster';

const Swal = require('sweetalert2');

@Component({
  selector: 'ngx-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.scss'],
})
export class ReclamationComponent {

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
  }

  ReclamationUrl = 'api/Reclamations/Reclamation/add';
  AllReclamationUrl = 'api/Reclamations/all';
  reclamationForm = new FormGroup({
    message: new FormControl(),
    subject: new FormControl(),
  });
  
  
  //
  submitted = false;


  onSubmit() {
    this.submitted = true;

    const options = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };
    this.http.post(this.ReclamationUrl,
      {
        message: this.reclamationForm.get('message').value,
        subject: this.reclamationForm.get('subject').value,

      }, options).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      if (resJSON.status === 'err') {
        Swal.fire(
          'error!',
          'Please write subject and message',
          'error',
        );
      } else {
        Swal.fire(
          'Success!',
          'Your Reclamation is Sent with success.',
          'success',
        );
        this.reclamationForm.reset();

      }
    }, error => {
    });
  }

  settings = {
    add: {
      addButtonContent: '<i class="nb-checkmark" aria-placeholder="recherche" hidden></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" hidden></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      message: {
        title: 'message',
        type: 'string',
      },
      subject: {
        title: 'subject',
        type: 'string',
      },
    },
  };
  options = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  data = this.http.get(this.AllReclamationUrl,
    this.options).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.data = resJSON;
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
        this.http.delete('/api/Reclamations/Reclamation/delete/' + event.data._id).subscribe();
        event.confirm.resolve();
        Swal.fire(
          'Success!',
          'Your Reclamation has been deleted.',
          'success',
        );
      }
    });
  }
}
