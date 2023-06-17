import {ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {NbDateService, NbThemeService} from '@nebular/theme';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DashService} from '../../dashboard/dash.service';

const Swal = require('sweetalert2');

@Component({
  selector: 'ngx-chartjs-multiple-xaxis',
  template: `
    <div>
      <div class="input-group col-md-11">
        <span class="input-group-addon">start date:</span>&nbsp;&nbsp;&nbsp;
        <angular2-date-picker [(ngModel)]="dateDebut" [settings]="settings"></angular2-date-picker>&nbsp;&nbsp;&nbsp;
        <span class="input-group-addon">Finish date:</span>&nbsp;&nbsp;&nbsp;
        <angular2-date-picker [(ngModel)]="dateFin" [settings]="settings"></angular2-date-picker>&nbsp;&nbsp;&nbsp;
        <span class="input-group-btn">&nbsp;&nbsp;
              <button type="button" (click)="getDateValues()" value="Click" id='btn' class="btn btn-info btn-flat"> ok </button>
            </span>
      </div>
    </div>
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsMultipleXaxisComponent implements OnDestroy {
  selectedOption;

  test() {
  }
  getDateValues(){
    console.log('getDateValues()')
  }

  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'hh:mm dd-MM-yyyy',
    defaultOpen: false,
  };
  data: {};
  options: any;
  themeSubscription: any;
  SensorUrl = 'api/sensors/sensor/findByType';
  token: {};
  private Sdata;
  create: [];
   temp = [];
   hum = [];
   light = [];
   energy = [null];
   lbl = [];
  constructor(private theme: NbThemeService, private http: HttpClient,
              private service: DashService,
              private ref: ChangeDetectorRef) {
    this.clearTable() ;
    this.token = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };

    this.service.dataMsg.subscribe(item => {
      this.clearTable() ;
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            let i = 0;
              for (i = 0; i < item.data.length; i++) {
                const date2 = new Date(item.data[i].time);
                let min;
                date2.getMinutes() > 10 ? (min = date2.getMinutes()) : min = '0' + date2.getMinutes();
                this.lbl.push(date2.getFullYear() + '/' + date2.getDate() + '/' + (date2.getMonth() + 1) + ' , '
                  + date2.getHours() + ':' + min + ' ');
                this.temp.push(item.data[i].tempValues);
                this.hum.push(item.data[i].humValues);
               // this.light.push(item.data[i].lightValues);
            }
        const colors: any = config.variables;
        const chartjs: any = config.variables.chartjs;
        this.data = {
          labels: this.lbl,
          datasets: [{
            label: 'Temperature',
            data: this.temp,
            borderColor: colors.dangerLight,
            backgroundColor: colors.dangerLight,
            fill: false,
            borderDash: [5, 5],
            pointRadius: 6,
            pointHoverRadius: 10,
          }, {
            label: 'Humidity',
            data: this.hum,
            borderColor: colors.info,
            backgroundColor: colors.info,
            fill: false,
            pointRadius: 6,
            pointHoverRadius: 10,
          }, /*{
            label: 'light',
            data: this.light,
            borderColor: colors.success,
            backgroundColor: colors.success,
            fill: false,
            pointRadius: 8,
            pointHoverRadius: 10,
          }*/],
        };

        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Month',
                },
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Value',
                },
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                },
              },
            ],
          },
        };
      });
      if (item.value === 'nan') {
        this.clearTable() ;
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
          this.Sdata = this.http.post(this.SensorUrl,
            {
              type: 'Sensor',
            }, this.token).subscribe(data => {
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.Sdata = resJSON;
          });
          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
          this.data = {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [{
              label: 'Temperature',
              data: [5, 16, 65, 20, 6, 9, 19, 20],
              borderColor: colors.dangerLight,
              backgroundColor: colors.dangerLight,
              fill: false,
              borderDash: [5, 5],
              pointRadius: 8,
              pointHoverRadius: 10,
            }, {
              label: 'Humidity',
              data: [20, 6, 16, 28, 19, 9, 19, 20],
              borderColor: colors.info,
              backgroundColor: colors.info,
              fill: false,
              pointRadius: 8,
              pointHoverRadius: 10,
            }, /*{
              label: 'light',
              data: [],
              borderColor: colors.success,
              backgroundColor: colors.success,
              fill: false,
              pointRadius: 8,
              pointHoverRadius: 10,
            }*/],
          };

          this.options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: 'bottom',
              labels: {
                fontColor: chartjs.textColor,
              },
            },
            hover: {
              mode: 'index',
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: 'Month',
                  },
                  gridLines: {
                    display: true,
                    color: chartjs.axisLineColor,
                  },
                  ticks: {
                    fontColor: chartjs.textColor,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: 'Value',
                  },
                  gridLines: {
                    display: true,
                    color: chartjs.axisLineColor,
                  },
                  ticks: {
                    fontColor: chartjs.textColor,
                  },
                },
              ],
            },
          };
        });
        this.clearTable() ;
      }
      const btn = document.getElementById('btn');
      if (btn != null) {
        btn.addEventListener('click', (e: Event) => {
          this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            this.clearTable() ;
            const debut = new Date(this.dateDebut).getTime();

            const fin = new Date(this.dateFin).getTime();
            if (debut >= fin) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Time Interval is wrong ',
              });
            } else {
              let i = 0;
              for (i = 0; i < 60; i++) {
                if (item.data[i].time <= fin && item.data[i].time >= debut) {
                  console.log('date debut' , debut) ;
                  console.log('date fin' , fin) ;
                  console.log('d5al el if ' , item.data[i].time) ;
                  this.temp.push(item.data[i].tempValues);
                  this.hum.push(item.data[i].humValues);
                  // this.light.push(item.data[i].ligValues);
                  const date = new Date(item.data[i].time);
                  let min;
                  date.getMinutes() > 10 ? (min = date.getMinutes()) : min = '0' + date.getMinutes();
                  this.lbl.push(date.getFullYear() + '/' + date.getDate() +
                    '/' + (date.getMonth() + 1) + ' ' + date.getHours() + ':' + min + ' ');
                }
              }
            }
            console.log(this.hum) ;
            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;
            this.data = {
              labels: this.lbl,
              datasets: [{
                label: 'Temperature',
                data: this.temp,
                borderColor: colors.dangerLight,
                backgroundColor: colors.dangerLight,
                fill: false,
                borderDash: [5, 5],
                pointRadius: 8,
                pointHoverRadius: 10,
              }, {
                label: 'Humidity',
                data: this.hum,
                borderColor: colors.info,
                backgroundColor: colors.info,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 10,
              }, {
                label: 'light',
                data: this.light,
                borderColor: colors.success,
                backgroundColor: colors.success,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 10,
              }],
            };

            this.options = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                position: 'bottom',
                labels: {
                  fontColor: chartjs.textColor,
                },
              },
              hover: {
                mode: 'index',
              },
              scales: {
                xAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Month',
                    },
                    gridLines: {
                      display: true,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
                yAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Value',
                    },
                    gridLines: {
                      display: true,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
              },
            };
          });
        });
        this.clearTable() ;
      }
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  /*

  async load_data() {
    this.ChartTab = [];
    this.currentSensorHistory = await this.pageService.currenthistoryMessage.subscribe(da => {
      console.log('data', da);
      if (Object.keys(da).length === 0) {
        console.log('data undefined', da);
      } else {
        this.Loaded = true;
        this.sensordata = da;
        console.log('sensordata1', this.sensordata);
        this.data_process(da.Sensor);
      }
    });
    this.ref.detectChanges();
  }

  searchByDate() {
    console.log('sensordata 3 ', this.sensordata);
    const debut = new Date(this.dateDebut).getTime() ;
    const fin = new Date(this.dateFin).getTime() ;
    if (debut >= fin) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Time Interval is wrong ',
      });
      return ;
    }
    console.log('sensordata 4' , this.sensordata);
    const s = this.sensordata.Sensor ;
    if (Object.keys(this.ChartTab).length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Plz Refrech The page',
      });
    } else {
      // console.log('data is ok', this.ChartTab);
      let i = 0;
      const usefull = [];
      for (i = 0 ; i < s.data.length; i++) {
        if (s.data[i].time < debut || s.data[i].time > fin) {
          // sensor.data.splice(i, 1 );
        } else {
          usefull.push(s.data[i]);
        }
      }
      // s.data = usefull;
      console.log('usefull ', usefull);
      console.log('sensordata', this.sensordata);
      console.log('s ', s);
      const obj = { Name : s.Name , data : usefull};
      this.data_process(obj);
    }
  }
*/
  clearTable() {
    this.lbl = [] ;
   // this.light = [] ;
    this.hum = [] ;
    this.lbl = [] ;
    this.energy = [] ;
  }
  private random() {
    return Math.round(Math.random() * 100);
  }
}
