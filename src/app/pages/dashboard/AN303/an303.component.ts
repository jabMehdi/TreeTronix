import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbThemeService,
  NbToastrService,
} from '@nebular/theme';
import {Temperature, TemperatureHumidityData} from '../../../@core/data/temperature-humidity';
import {takeWhile} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToasterConfig} from 'angular2-toaster';
import {DashService} from '../dash.service';
@Component({
  selector: 'ngx-an303',
  templateUrl: './an303.component.html',
  styleUrls: ['./an303.component.scss']
})
export class An303Component implements OnDestroy {
  private alive = true;

  temperatureData: Temperature;
  temperature: number ;
  temperatureOff = false;
  temperatureMode = 'cool';

  humidityData: Temperature;
  humidity: number;
  humidityOff = false;
  humidityMode = 'heat';
  theme: any;
  themeSubscription: any;
  public id_fac: any;
  public data;
  option = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };

  constructor(private themeService: NbThemeService,
    private temperatureHumidityService: TemperatureHumidityData,
    private http: HttpClient, private router: Router,
    private toastrService: NbToastrService,
    private service: DashService,

  ) {
    this.service.currentRelayMessage.subscribe(data => {
      this.service.ChartUpdatefunction(localStorage.getItem('token'), data);
      this.service.ChartUpdateValue.subscribe(ok => {
        if (ok.value === 'nan') {
          this.getData();
        }
    if (data.value === 'nan') {
      this.getData();
    } else {
      this.id_fac = data;
      const option = {
        params: new HttpParams().append('token', localStorage.getItem('token')),
      };
      this.http.post('/api/sensors/sensor/findByType',
        {
          type: 'AN-303',
          factoryId: this.id_fac,
        }, option).subscribe(data2 => {
        const resSTR = JSON.stringify(data2);
        const resJSON = JSON.parse(resSTR);
        this.data = resJSON;
        console.log('aaaaaaaahhhhhjjjjjjjjjjj --- 2220 ' , this.data)
        this.data.forEach(item => {
          //   this.NotifToast(item);
        });
      });
    }
  }); });
  this.themeService.getJsTheme()
    .pipe(takeWhile(() => this.alive))
    .subscribe(config => {
      this.theme = config.variables.temperature;
    });

  forkJoin(
    this.temperatureHumidityService.getTemperatureData(),
    this.temperatureHumidityService.getHumidityData(),
  )
    .subscribe(([temperatureData, humidityData]: [Temperature, Temperature]) => {
      this.temperatureData = temperatureData;
      this.humidityData = humidityData;
    //  this.temperature = this.temperatureData;
      this.humidity = this.humidityData.value;
    });

   }
   getData() {
    const option = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };
    console.log('option----' , option)
    this.http.post('/api/sensors/sensor/findByType',
      {
        type: 'AN-303',
      }, option).subscribe(data2 => {
      const resSTR = JSON.stringify(data2);
      const resJSON = JSON.parse(resSTR);
      this.data = resJSON;
      console.log('99kh999' , this.data)

    });
  }

  // toast data
  config: ToasterConfig;
  index = 1;
  destroyByClick = true;
  duration = 6000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = 'danger';
  title = ' Alert !!';
  content = '';

  /* makeToast() {
     this.showToast(this.status, this.title, this.content);
   }

   private showToast(type: NbComponentStatus, title: string, body: string) {
     const config = {
       status: type,
       destroyByClick: this.destroyByClick,
       duration: this.duration,
       hasIcon: true,
       position: this.position,
       preventDuplicates: this.preventDuplicates,
     };
     const titleContent = title;
     this.index += 1;
     this.toastrService.show(
       body,
       `${titleContent}`,
       config);
   }
   */

  getstatus(value) {

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


  ngOnDestroy() {
    this.alive = false;
  }
}
