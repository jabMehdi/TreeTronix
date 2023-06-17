import { delay } from 'rxjs/operators';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {HttpClient, HttpParams} from '@angular/common/http';
import any = jasmine.any;

declare const echarts: any;

@Component({
  selector: 'ngx-solar',
  styleUrls: ['./solar.component.scss'],
  template: `
    <nb-card size="medium" class="solar-card" *ngFor="let s of data ">
      <nb-card-header><h4 style=" color: #3366ff ; text-align: center "> {{s.name}} <span style=" color: #091209 ; ">( ID :{{s.code}})</span>
      </h4></nb-card-header>
      <nb-card-body>
        <div style="text-align: center;">
          <rg-gauge-chart
            [canvasWidth]="canvasWidth"
            [needleValue]= "needleValue"
            [centralLabel]="centralLabel"
            [options]="options"
            [bottomLabel]="bottomLabel"></rg-gauge-chart>&nbsp;&nbsp;
          <h5 class="text-primary" style=" align-self: center;"> In {{s.factoryName}} </h5>
      </div>
      </nb-card-body>
    </nb-card>
  `,
})
export class SolarComponent implements AfterViewInit, OnDestroy {
  private  data ;
  private value = 0;
  private GazValue ;
  public canvasWidth = 500 ;
  public needleValue  ;
  public centralLabel = '' ;
  public bottomLabel = 'm3'  ;
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 10,
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    arcDelimiters: [50],
    rangeLabel: ['0', '100'],
    needleStartValue: 20,
  } ;

  @Input('chartValue')
  set chartValue(value: number) {
    this.value = 10;

    if (this.option.series) {
      this.option.series[0].data[0].value = 50;
      this.option.series[0].data[1].value = 100 - value;
      this.option.series[1].data[0].value = value;
    }
  }

  option: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService , private http: HttpClient) {
    const optionss = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };
    this.http.post('/api/sensors/sensor/findByType',
      {
        type : 'GasMeter',
      }, optionss).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      this.data = resJSON;
      this.data.forEach(item => {
        const c = item.Countersdata.length - 1 ;
        this.centralLabel = item.Countersdata[c].Gas_data.substring(4 , 8) ;
        this.needleValue = item.Countersdata[c].Gas_data ;
        this.option.arcDelimiters = item.Countersdata[c].Gas_data ;
        console.log(this.needleValue);

      });
    });
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {

      const solarTheme: any = config.variables.solar;

      this.option = Object.assign({}, {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: ' ',
            clockWise: true,
            hoverAnimation: false,
            type: 'pie',
            center: ['45%', '50%'],
            radius: solarTheme.radius,
            data: [
              {
                value: this.value,
                name: ' ',
                label: {
                  normal: {
                    position: 'center',
                    formatter: '{d}%',
                    textStyle: {
                      fontSize: '22',
                      fontFamily: config.variables.fontSecondary,
                      fontWeight: '600',
                      color: config.variables.fgHeading,
                    },
                  },
                },
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: solarTheme.gradientLeft,
                      },
                      {
                        offset: 1,
                        color: solarTheme.gradientRight,
                      },
                    ]),
                    shadowColor: solarTheme.shadowColor,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                  },
                },
                hoverAnimation: false,
              },
              {
                value: 100 ,
                name: ' ',
                tooltip: {
                  show: false,
                },
                label: {
                  normal: {
                    position: 'inner',
                  },
                },
                itemStyle: {
                  normal: {
                    color: solarTheme.secondSeriesFill,
                  },
                },
              },
            ],
          },
          {
            name: ' ',
            clockWise: true,
            hoverAnimation: false,
            type: 'pie',
            center: ['45%', '50%'],
            radius: solarTheme.radius,
            data: [
              {
                value: this.value,
                name: ' ',
                label: {
                  normal: {
                    position: 'inner',
                    show: false,
                  },
                },
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: solarTheme.gradientLeft,
                      },
                      {
                        offset: 1,
                        color: solarTheme.gradientRight,
                      },
                    ]),
                    shadowColor: solarTheme.shadowColor,
                    shadowBlur: 7,
                  },
                },
                hoverAnimation: false,
              },
              {
                value: 28,
                name: ' ',
                tooltip: {
                  show: false,
                },
                label: {
                  normal: {
                    position: 'inner',
                  },
                },
                itemStyle: {
                  normal: {
                    color: 'none',
                  },
                },
              },
            ],
          },
        ],
      });
    });
  }
  getstatus (value) {

    if (value <= 25) {
      return 'danger';
    } else if (value <= 50) {
      return 'warning';
    } else if (value <= 75) {
      return 'info';
    } else {
      return 'success';
    }
  }
 /*getData() {
  const optionss = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  this.http.post('api/sensors/sensor/findByType',
    {
      type : 'Esonsor',
    }, optionss).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.data = resJSON;
    this.data.forEach(item => {
      const c = item.otherVal.length - 1 ;
      this.Evalue = item.otherVal[c] ;

    });
  });
}*/
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
