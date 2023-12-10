import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';


@Component({
  selector: 'ngx-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {

  constructor(private http: HttpClient) {
  }

  SensorUrl = 'api/sensors/sensor/findByUser';
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus" hidden ="true"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" hidden></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"  style="\n' +
        '    color: red;"></i>',
      confirmDelete: true,
    },
    columns: {
      code: {
        title: 'code',

      },
      name: {
        title: 'Sensor name',

      },
      tempValues: {
        title: ' temperature Values',
      },
      humValues: {
        title : 'humidity',
      },
      otherVal: {
        title: 'Energy Cons',
      },
      type: {
        title: 'type',
      },
      factoryName: {
        title: 'Factory Name  ',
      },
    },
  };

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.http.post('/a' + event.data.code, {}, this.options).subscribe(
        res => {
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
          } else {
          }
        });
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  hum: [];
  temp: any;
  creatDate: any;
  data: any;
  data2: {
    tempValues: [{ 26, 25 }],
  } ;
  options = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  tdata = this.http.post(this.SensorUrl,
    {}, this.options).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.data = resJSON;
    this.data.foreach(item => {
      this.data2 = item ;
    });
    const options = [];
    for (const unit of this.data) {
      options.push({value: unit.humValues[2], title: 'ok'});
      this.settings.columns.humValues = unit.humValues.map(function(unitt) {
        return { value: unitt};
      });
    }
   // this.settings.columns.humValues.list = options;
    this.settings = Object.assign({}, this.settings);

  });
}

