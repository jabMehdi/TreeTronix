import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DecoderButtonComponent } from '../decode-button/decode-button.component';
import { DeleteDataButtonComponent } from '../delete-data-button/delete-data-button.component';

@Component({
  selector: 'ngx-s-devices',
  templateUrl: './s-devices.component.html',
  styleUrls: ['./s-devices.component.scss'],
})
export class SDevicesComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}
  rowData: any;
  DeleteDataUrl = '/api/sensors/sensor/Data_remID';
  selectedRows;
  SensorUrl = '/api/sensors/sensor/findByUser';
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
      deleteButtonContent: '<i class="nb-trash" style="color: red;"></i>',
      confirmDelete: true,
    },
    columns: {
      code: {
        title: 'ID',
        type: 'string',
      },
      name: {
        title: 'Sensor name',
        type: 'string',
      },
      type: {
        title: 'Type',
        type: 'string',
      },
      factoryName: {
        title: 'Factory Name',
        type: 'string',
      },
      area: {
        title: 'Area',
        type: 'string',
      },
      actions: {
        title: 'Decoder',
        type: 'custom',
        renderComponent: DecoderButtonComponent,
        onCustomAction: this.onCustomAction.bind(this),
      },
      deleteData: { // New column configuration
        title: 'Delete Data',
        type: 'custom',
        renderComponent: DeleteDataButtonComponent,
        onCustomAction: this.onDeleteData.bind(this),
      },
    },
  };
  
  ngOnInit(): void {
    this.data = [];
    this.loadData();
  }

  loadData(): void {
    const options = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };

    this.http.post(this.SensorUrl, {}, options).subscribe(
      (data) => {
        this.data = data;
        console.log('All sensors data:', this.data);
      },
      (err: HttpErrorResponse) => {
        console.error('An error occurred while fetching data:', err);
      }
    );
  }

  onEditConfirm(event): void {
    const options = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };

    this.http
      .post('/api/sensors/sensor/update/', {
        id: event.newData._id,
        name: event.newData.name,
        area: event.newData.area,
      }, options)
      .subscribe(
        () => {
          event.confirm.resolve(event.newData);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your device has been updated',
            showConfirmButton: false,
            timer: 1500,
          });
        },
        (err: HttpErrorResponse) => {
          console.error('An error occurred while updating device:', err);
        }
      );
  }

  onDeleteConfirm(event): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        const options = {
          params: new HttpParams().append('token', localStorage.getItem('token')),
        };

        this.http
          .post('/api/sensors/sensor/updateUserAndFactory/' + event.data.code, {}, options)
          .subscribe(
            () => {
              event.confirm.resolve();
              Swal.fire('Success!', 'Your Device has been deleted.', 'success');
            },
            (err: HttpErrorResponse) => {
              console.error('An error occurred while deleting device:', err);
            }
          );
      }
    });
  }

  onDeleteData(rowData: any): void {
    const index = this.data.indexOf(rowData);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }
  

  


  onCustomAction(event: any): void {
    if (event.action === 'decode') {
      const { code, _id } = event.data;
      this.navigateToSensorData({ code, sensorId: _id });
    }
  }
  

  navigateToSensorData(sensor: any): void {
    this.router.navigate(['pages/decoders', sensor.code, sensor.sensorId]);
  }
  

  data: any;
}
