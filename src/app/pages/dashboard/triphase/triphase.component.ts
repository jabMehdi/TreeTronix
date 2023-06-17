import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { NbThemeService, NbToggleModule } from "@nebular/theme";
import { HttpClient, HttpParams } from "@angular/common/http";
import any = jasmine.any;

declare const echarts: any;

@Component({
  selector: "ngx-triphase",
  styleUrls: ["./triphase.component.scss"],
  templateUrl: "./triphas.component.html"
})
export class TriphaseComponent {
  toggleColor = "danger";
  // triphaseId = "60f4658f70e3d90bac60c385";
  // chekedValue;
  private data;
  private value = 0;
  private VoltagePhaseA;
  private VoltagePhaseB;
  private VoltagePhaseC;
  private CurrentPhaseA;
  private CurrentPhaseB;
  private CurrentPhaseC;

  private ActivePowerTotal;
  private ActivePowerPhaseA;
  private ActivePowerPhaseB;
  private ActivePowerPhaseC;
  private PowerFactorTotal;
  private PowerFactorPhaseA;
  private PowerFactorPhaseB;
  private PowerFactorPhaseC;
  //
  private ComActiveTotal;
  private PositiveActiveTotal;
  private ReverseActiveTotal;
  // gauge
  canvasWidth = 200;
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
  // needle
  needleValue_ComActiveTotal;
  needleValue_PositiveActiveTotal;
  needleValue_ReverseActiveTotal;
  needleValue_ActivePowerTotal;
  // label
  label_ComActiveTotal = "";
  label_PositiveActiveTotal = "";
  label_ReverseActiveTotal = "";
  label_ActivePowerTotal = "";

  option: any = {};
  code;

  chekedValue = localStorage.getItem("tri");
  chekedboolean: boolean = localStorage.getItem("tri") != "true";

  optionss = {
    params: new HttpParams().append("token", localStorage.getItem("token"))
  };
  constructor(private theme: NbThemeService, private http: HttpClient) {
    this.chekedValue = localStorage.getItem("tri");

    if (this.chekedboolean) {
      this.toggleColor = "success";
    }

    this.http
      .post(
        "/api/sensors/sensor/findByType",
        {
          type: "triphase"
        },
        this.optionss
      )
      .subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.data = resJSON;

        this.data.forEach(item => {
          console.log("itemmmm" + item.factoryId);
          this.code = item.code;
          const couterCom = item.ConsomationTripahse.length - 1;
          const counterCV = item.Voltage_CurrentrTipahse.length - 1;
          const counterpos = item.PositiveTripahse.length - 1;
          const counterRev = item.ReverserTipahse.length - 1;
          const i = item.ActivePowerTipahse.length - 1;
          //
          this.VoltagePhaseA =
            item.Voltage_CurrentrTipahse[counterCV].VoltagePhaseA;
          this.VoltagePhaseB =
            item.Voltage_CurrentrTipahse[counterCV].VoltagePhaseB;
          this.VoltagePhaseC =
            item.Voltage_CurrentrTipahse[counterCV].VoltagePhaseC;
          this.CurrentPhaseA =
            item.Voltage_CurrentrTipahse[counterCV].CurrentPhaseA;
          this.CurrentPhaseB =
            item.Voltage_CurrentrTipahse[counterCV].CurrentPhaseB;
          this.CurrentPhaseC =
            item.Voltage_CurrentrTipahse[counterCV].CurrentPhaseC;
          //
          this.ActivePowerTotal = item.ActivePowerTipahse[i].ActivePowerTotal;
          this.ActivePowerPhaseA = item.ActivePowerTipahse[i].ActivePowerPhaseA;
          this.ActivePowerPhaseB = item.ActivePowerTipahse[i].ActivePowerPhaseB;
          this.ActivePowerPhaseC = item.ActivePowerTipahse[i].ActivePowerPhaseC;
          this.PowerFactorTotal = item.ActivePowerTipahse[i].PowerFactorTotal;
          this.PowerFactorPhaseA = item.ActivePowerTipahse[i].PowerFactorPhaseA;
          this.PowerFactorPhaseB = item.ActivePowerTipahse[i].PowerFactorPhaseB;
          this.PowerFactorPhaseC = item.ActivePowerTipahse[i].PowerFactorPhaseC;
          //
          this.needleValue_ComActiveTotal =
            item.ConsomationTripahse[couterCom].ComActiveTotal;
          this.label_ComActiveTotal = item.ConsomationTripahse[
            couterCom
          ].ComActiveTotal.substring(3, 8);
          this.needleValue_ActivePowerTotal =
            item.ActivePowerTipahse[i].ActivePowerTotal;
          this.label_ActivePowerTotal = item.ActivePowerTipahse[
            i
          ].ActivePowerTotal.substring(0, 6);

          this.needleValue_PositiveActiveTotal =
            item.PositiveTripahse[counterpos].PositiveActiveTotal;
          //
          this.label_PositiveActiveTotal = item.PositiveTripahse[
            counterpos
          ].PositiveActiveTotal.substring(2, 8);

          this.label_ReverseActiveTotal = item.ReverserTipahse[
            counterRev
          ].ReverseActiveTotal.substring(2, 8);
          this.needleValue_ReverseActiveTotal =
            item.ReverserTipahse[counterRev].ReverseActiveTotal;
          //
        });
      });
  }

  onChange() {
    var event = false;
    var isthis = localStorage.getItem("tri");

    if (isthis == "true") {
      event = true;
      localStorage.setItem("tri", "false");
      console.log("oooo" + localStorage.getItem("tri"));
      this.toggleColor = "success";
    } else {
      localStorage.setItem("tri", "true");
      console.log(localStorage.getItem("tri"));
      this.toggleColor = "danger";
    }

    console.log("triphase: " + event);
    this.http
      .post(
        "/api/DownLink/SensorOff",
        { code: this.code, event: event },
        this.optionss
      )
      .subscribe(data => {
        console.log("data from pyhton to tri: " + data);
      });
  }
}
