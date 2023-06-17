import { AfterViewInit, Component, Input, OnDestroy } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { HttpClient, HttpParams } from "@angular/common/http";

declare const echarts: any;

@Component({
  selector: "ngx-monophase",
  styleUrls: ["./monophase.component.scss"],
  templateUrl: "./monophase.component.html"
})
export class MonophaseComponent {
  chekedValue = localStorage.getItem("mono");
  chekedboolean: boolean = localStorage.getItem("mono") != "true";
  toggleColor = "danger";

  private data;
  private value = 0;
  private GazValue;
  code;
  ComActiveTotalEnergy;
  PositiveActiveTotalEnergy;
  ReverseActiveTotalEnergy;
  Voltage;
  Current;
  ActivePower;
  PowerGridFrequency;
  PowerFactor;
  // chars consomation active energy
  canvasWidth = 200;
  needleValue_com_total_energy;
  label_com_total_energy = "";

  needleValue_PositiveActiveTotalEnergy;
  label_PositiveActiveTotalEnergy = "";
  //
  needleValue_ReverseActiveTotalEnergy;
  label_ReverseActiveTotalEnergy = "";
  //
  needleValue_ActivePower;
  label_ActivePower = "";

  public bottomLabel = "Kwh";
  public bottomLabelW = "Kw";
  public options = {
    hasNeedle: true,
    needleColor: "gray",
    needleUpdateSpeed: 10,
    arcColors: ["rgb(44, 151, 222)", "lightgray"],
    arcDelimiters: [50],
    rangeLabel: ["0", "3"],
    needleStartValue: 20
  };
  public options2 = {
    hasNeedle: true,
    needleColor: "gray",
    needleUpdateSpeed: 10,
    arcColors: ["rgb(44, 151, 222)", "lightgray"],
    arcDelimiters: [50],
    rangeLabel: ["0", "120"],
    needleStartValue: 20
  };
  public options3 = {
    hasNeedle: true,
    needleColor: "gray",
    needleUpdateSpeed: 10,
    arcColors: ["rgb(44, 151, 222)", "lightgray"],
    arcDelimiters: [50],
    rangeLabel: ["0", "240"],
    needleStartValue: 20
  };
  public options4 = {
    hasNeedle: true,
    needleColor: "gray",
    needleUpdateSpeed: 10,
    arcColors: ["rgb(44, 151, 222)", "lightgray"],
    arcDelimiters: [50],
    rangeLabel: ["0", "50"],
    needleStartValue: 30
  };
  themeSubscription: any;
  name1: any = "Com Active Total Energy";
  name2: any = "Positive Active Total Energy";
  name3: any = "Reverse Active Total Energy";
  name4: any = "ActivePower";
  optionss;

  constructor(private theme: NbThemeService, private http: HttpClient) {
    this.chekedValue = localStorage.getItem("mono");
    console.log("constr" + this.chekedValue);
    if (this.chekedboolean) {
      this.toggleColor = "success";
    }

    this.optionss = {
      params: new HttpParams().append("token", localStorage.getItem("token"))
    };
    this.http
      .post(
        "/api/sensors/sensor/findByType",
        {
          type: "mono"
        },
        this.optionss
      )
      .subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.data = resJSON;
        this.data.forEach(item => {
          this.code = item.code;
          console.log("item code: " + item.code);
          const c = item.Countersdata.length - 1;
          this.PositiveActiveTotalEnergy =
            item.Countersdata[c].PositiveActiveTotalEnergy;
          this.ReverseActiveTotalEnergy =
            item.Countersdata[c].ReverseActiveTotalEnergy;
          this.Voltage = item.Countersdata[c].Voltage;
          this.Current = item.Countersdata[c].Current;
          this.ActivePower = item.Countersdata[c].ActivePower;
          this.PowerGridFrequency = item.Countersdata[c].PowerGridFrequency;
          this.PowerFactor = item.Countersdata[c].PowerFactor;

          this.label_com_total_energy = item.Countersdata[
            c
          ].ComActiveTotalEnergy.substring(4, 10);
          this.needleValue_com_total_energy = 2;
          //this.option.arcDelimiters = item.Countersdata[c].ComActiveTotalEnergy ;
          //
          this.label_PositiveActiveTotalEnergy = item.Countersdata[
            c
          ].PositiveActiveTotalEnergy.substring(4, 10);
          this.needleValue_PositiveActiveTotalEnergy =
            item.Countersdata[c].PositiveActiveTotalEnergy;
          //  this.option.arcDelimiters = item.Countersdata[c].PositiveActiveTotalEnergy ;
          //
          this.label_ReverseActiveTotalEnergy = item.Countersdata[
            c
          ].ReverseActiveTotalEnergy.substring(4, 10);
          this.needleValue_ReverseActiveTotalEnergy =
            item.Countersdata[c].ReverseActiveTotalEnergy;
          //   this.option.arcDelimiters = item.Countersdata[c].ReverseActiveTotalEnergy ;
          //
          this.label_ActivePower = item.Countersdata[c].ActivePower.substring(
            4,
            10
          );
          this.needleValue_ActivePower = item.Countersdata[c].ActivePower;
          // this.option.arcDelimiters = item.Countersdata[c].ActivePower ;
        });
      });
  }

  onclickmomo() {
    var event = false;
    var isthis = localStorage.getItem("mono");
    //status="danger"

    if (isthis == "true") {
      event = true;
      localStorage.setItem("mono", "false");
      console.log("oooo" + localStorage.getItem("mono"));
      this.toggleColor = "success";
    } else {
      localStorage.setItem("mono", "true");
      console.log(localStorage.getItem("mono"));
      this.toggleColor = "danger";
    }

    console.log("OnChange: " + event);
    this.http
      .post(
        "/api/DownLink/SensorOff",
        { code: this.code, event: event },
        this.optionss
      )
      .subscribe(data => {
        console.log("data from pyhton: " + data);
      });
  }

  /* old on off button
  onChange(event) {
    console.log("OnChange: " + event);
    this.http
      .post(
        "/api/DownLink/SensorOff",
        { code: this.code, event: event },
        this.optionss
      )
      .subscribe(data => {
        console.log("data from pyhton: " + data);
      });
  }*/
}
