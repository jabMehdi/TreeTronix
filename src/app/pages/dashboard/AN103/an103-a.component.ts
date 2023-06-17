import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbThemeService,
  NbToastrService
} from "@nebular/theme";
import {
  Temperature,
  TemperatureHumidityData
} from "../../../@core/data/temperature-humidity";
import { takeWhile } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToasterConfig } from "angular2-toaster";
import { DashService } from "../dash.service";

@Component({
  selector: 'ngx-an103-a',
  templateUrl: './an103-a.component.html',
  styleUrls: ['./an103-a.component.scss']
})
export class An103AComponent implements OnDestroy {
  private alive = true;

  temperatureData: Temperature;
  temperature: number;
  temperatureOff = false;
  temperatureMode = "cool";

  humidityData: Temperature;
  humidity: number;
  humidityOff = false;
  humidityMode = "heat";
  theme: any;
  themeSubscription: any;
  public id_fac: any;
  public data;
  option = {
    params: new HttpParams().append("token", localStorage.getItem("token"))
  };

  constructor(private themeService: NbThemeService,
    private temperatureHumidityService: TemperatureHumidityData,
    private http: HttpClient,
    private router: Router,
    private toastrService: NbToastrService,
    private service: DashService) { 
      
    /*
    this.service.currentRelayMessage.subscribe(data => {
      this.service.ChartUpdatefunction(localStorage.getItem("token"), data);
      this.service.ChartUpdateValue.subscribe(ok => {
        if (ok.value === "nan") {
          this.getData();
        }
        if (data.value === "nan") {
          this.getData();
        } else {
          this.id_fac = data;
          const option = {
            params: new HttpParams().append(
              "token",
              localStorage.getItem("token")
            )
          };
          this.http
            .post(
              "/api/sensors/sensor/findByType",
              {
                type: "Sensor",
                factoryId: this.id_fac
              },

              option
            )

            .subscribe(data2 => {
              const resSTR = JSON.stringify(data2);
              const resJSON = JSON.parse(resSTR);
              this.data = resJSON;
              this.data.forEach(item => {
                //   this.NotifToast(item);
              });
            });
        }
      });
    });*/

    this.service.currentRelayMessage.subscribe(data => {
      this.service.ChartUpdatefunction(localStorage.getItem("token"), data);
      this.service.ChartUpdateValue.subscribe(ok => {
        if (ok.value === "nan") {
          this.getData2();
        }
        if (data.value === "nan") {
          this.getData2();
        } else {
          this.id_fac = data;
          const option = {
            params: new HttpParams().append(
              "token",
              localStorage.getItem("token")
            )
          };
          this.http
            .post(
              "/api/sensors/sensor/findByType",
              {
                type: "AN-103A",
                factoryId: this.id_fac
              },

              option
            )

            .subscribe(data2 => {
              const resSTR = JSON.stringify(data2);
              const resJSON = JSON.parse(resSTR);
              this.data = resJSON;
              this.data.forEach(item => {
                //   this.NotifToast(item);
              });
            });
        }
      });
    });

    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        this.theme = config.variables.temperature;
      });

    forkJoin(
      this.temperatureHumidityService.getTemperatureData(),
      this.temperatureHumidityService.getHumidityData()
    ).subscribe(
      ([temperatureData, humidityData]: [Temperature, Temperature]) => {
        this.temperatureData = temperatureData;
        this.humidityData = humidityData;
        //  this.temperature = this.temperatureData;
        this.humidity = this.humidityData.value;
      }
    );

    }
    getData() {
      const option = {
        params: new HttpParams().append("token", localStorage.getItem("token"))
      };
      this.http
        .post(
          "/api/sensors/sensor/findByType",
          {
            type: "Sensor"
          },
          option
        )
        .subscribe(data2 => {
          const resSTR = JSON.stringify(data2);
          const resJSON = JSON.parse(resSTR);
          this.data = resJSON;
        });
    }
    getData2() {
      const option = {
        params: new HttpParams().append("token", localStorage.getItem("token"))
      };
      this.http
        .post(
          "/api/sensors/sensor/findByType",
          {
            type: "AN-103A"
          },
          option
        )
        .subscribe(data2 => {
          const resSTR = JSON.stringify(data2);
          const resJSON = JSON.parse(resSTR);
          this.data = resJSON;
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
  status: NbComponentStatus = "danger";
  title = " Alert !!";
  content = "";

  getstatus(value) {
    if (value <= 25) {
      return "danger";
    } else if (value <= 50) {
      return "warning";
    } else if (value <= 75) {
      return "info";
    } else {
      return "success";
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
