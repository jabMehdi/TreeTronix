import { Component, OnDestroy } from "@angular/core";
import { NbThemeService, NbColorHelper } from "@nebular/theme";
import { DashService } from "../../dashboard/dash.service";
import { ChartType } from "chart.js";
const Swal = require("sweetalert2");
@Component({
  selector: "ngx-chartjs-Radar",
  template: `
    <div class="row">
      <div class="col-lg-10"></div>
      <div class="col-lg-2">
        <button
          _ngcontent-csk-c27=""
          type="submit"
          nbbutton=""
          status="success"
          _nghost-csk-c16=""
          ng-reflect-status="success"
          class="appearance-filled size-medium status-success shape-rectangle transitions"
          aria-disabled="false"
          tabindex="0"
          [disabled]="SensorSelected != 'ok'"
          (click)="fct()"
        >
          Export To Exel
        </button>

        <br /><br />
      </div>
    </div>

    <div class="row">
      <div class="input-group col-md-9">
        <span class="input-group-addon">start date:</span>&nbsp;&nbsp;&nbsp;
        <angular2-date-picker
          [(ngModel)]="dateDebut"
          [settings]="settings"
        ></angular2-date-picker
        >&nbsp;&nbsp;&nbsp;
        <span class="input-group-addon">Finish date:</span>&nbsp;&nbsp;&nbsp;
        <angular2-date-picker
          [(ngModel)]="dateFin"
          [settings]="settings"
        ></angular2-date-picker
        >&nbsp;&nbsp;&nbsp;
      </div>
      <div class="input-group col-md-3">
        <span class="input-group-addon">Choose a day:</span>&nbsp;&nbsp;&nbsp;
        <angular2-date-picker
          [(ngModel)]="OneDay"
          [settings]="settings"
        ></angular2-date-picker
        >&nbsp;&nbsp;&nbsp;
        <span class="input-group-btn"
          >&nbsp;&nbsp;
          <button
            type="button"
            value="Click"
            (click)="getDateValues()"
            id="btn"
            class="btn btn-info btn-flat"
          >
            ok
          </button>
        </span>
      </div>
      <a style="cursor: pointer" (click)="exportexcel()">
        <!--mat-icon> cloud_download</mat-icon-->
      </a>
    </div>
    <chart type="radar" [data]="data" [options]="options"></chart>

  `
})
export class ChartjsRadarComponent implements OnDestroy {
  data: any;
  options: any;
  type: ChartType = "radar";
  themeSubscription: any;
  dateDebut: Date = null;
  dateFin: Date = null;
  OneDay: Date = null;
  DataTableOne = [];
  DataTableTwo = [];
  DataTableThree = [];
  CurrentSensor;
  SensorLength;
  LastSensorTemp;
  DataTimePath;
  DataTimePath2;
  DataTimePath3;
  TableOneDataPath;
  TableTwoDataPath;
  Table3;
  Table4;
  Table5;
  TableThreeDataPath;
  SensorOneType;
  SensorTwoType;
  SensorThreeType;
  SensorSelected: any = "notok";
  datasetToExcel = [];
  ExcelItem;
  Courant;
  volt;

  settings = {
    bigBanner: true,
    timePicker: true,
    format: "hh:mm dd-MM-yyyy",
    defaultOpen: false
  };
  label = [];
  CurrentSensorData = [];

  getDateValues() {
    const DDD = new Date(this.dateDebut);
    const DFF = new Date(this.dateFin);

    const OD = new Date(this.OneDay);
    console.log(this.dateDebut);
    if ((this.dateDebut == null || this.dateFin == null) && OD == null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a date "
      });
    } else if (DDD.getTime() > DFF.getTime()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Wrong interval !  "
      });
    } else {
      this.BindingDataService.dataMsg.subscribe(SensorReceived => {
        this.SensorSelected = "ok";
        console.log("sensorselected: " + this.SensorSelected);
        this.clearTable();
        this.CurrentSensor = SensorReceived;
        switch (this.CurrentSensor.type) {
          case "Sensor":
            this.SensorLength = this.CurrentSensor.data.length;
            this.LastSensorTemp = new Date(
              this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time
            );
            this.DataTimePath = this.CurrentSensor.data;
            this.DataTimePath2 = this.CurrentSensor.ReverserTipahse;
            this.DataTimePath3 = this.CurrentSensor.ConsomationTripahse;
            this.TableOneDataPath = this.CurrentSensor.data;
            this.TableTwoDataPath = this.CurrentSensor.data;
            this.SensorOneType = "Temperature";
            this.SensorTwoType = "Humidity";
            break;
          case "AN-103A":
            this.SensorLength = this.CurrentSensor.data.length;
            this.LastSensorTemp = new Date(
              this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time
            );
            this.DataTimePath = this.CurrentSensor.data;
            this.TableOneDataPath = this.CurrentSensor.data;
            this.TableTwoDataPath = this.CurrentSensor.data;
            this.SensorOneType = "Temperature";
            this.SensorTwoType = "Humidity";
            break;
          case "mono":
            this.SensorLength = this.CurrentSensor.Countersdata.length;
            this.LastSensorTemp = new Date(
              this.CurrentSensor.Countersdata[
                this.CurrentSensor.Countersdata.length - 1
              ].time
            );
            this.DataTimePath = this.CurrentSensor.ActivePowerTipahse;
            this.TableOneDataPath = this.CurrentSensor.Countersdata;
            this.TableTwoDataPath = this.CurrentSensor.Countersdata;
            this.SensorOneType = "Active Power"; //Consumption
            var D1 = this.TableOneDataPath[0].PositiveActiveTotalEnergy;
            var D2 = this.TableOneDataPath[0].ReverseActiveTotalEnergy;
            break;
          case "triphase":
            this.SensorLength = this.CurrentSensor.PositiveTripahse.length;
            this.DataTimePath = this.CurrentSensor.PositiveTripahse;
            this.TableOneDataPath = this.CurrentSensor.PositiveTripahse;
            this.TableTwoDataPath = this.CurrentSensor.ReverserTipahse;
            this.Table3 = this.CurrentSensor.ActivePowerTipahse;
            this.Table4 = this.CurrentSensor.ConsomationTripahse;
            this.Table5 = this.CurrentSensor.Voltage_CurrentrTipahse;
            this.SensorOneType = "Active Power Total "; //Consumption
            var D3 = this.TableOneDataPath[0].PositiveActiveTotal;
            var D4 = this.TableTwoDataPath[0].ReverseActiveTotal;
            break;
          case "WaterMeter":
            this.SensorLength = this.CurrentSensor.Countersdata.length;
            this.LastSensorTemp = new Date(
              this.CurrentSensor.Countersdata[
                this.CurrentSensor.Countersdata.length - 1
              ].time
            );
            this.DataTimePath = this.CurrentSensor.Countersdata;
            this.TableOneDataPath = this.CurrentSensor.Countersdata;
            this.SensorOneType = "Water_data";

            break;
          case "smoke":
            this.SensorLength = this.CurrentSensor.data.length;
            this.LastSensorTemp = new Date(
              this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time
            );
            this.DataTimePath = this.CurrentSensor.data;
            this.TableOneDataPath = this.CurrentSensor.data;
            this.TableTwoDataPath = this.CurrentSensor.data;
            this.SensorOneType = "Insident";
            // this.SensorTwoType = "NoInsident"

            break;

            case "AN-303":
            this.SensorLength = this.CurrentSensor.data.length;
            this.LastSensorTemp = new Date(
              this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time
            );
            this.DataTimePath = this.CurrentSensor.data;
            this.TableOneDataPath = this.CurrentSensor.data;
            this.TableTwoDataPath = this.CurrentSensor.data;
            this.SensorOneType = "Temperature";
            this.SensorTwoType = "Humidity";
            break;
            
            case "AN-305A":
              this.SensorLength = this.CurrentSensor.data.length;
              this.LastSensorTemp = new Date(
                this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time
              );
              this.DataTimePath = this.CurrentSensor.data;
              this.TableOneDataPath = this.CurrentSensor.data;
              
              this.SensorOneType = "Door contact status";

            
              break;

              case "AN-302":
              this.SensorLength = this.CurrentSensor.data.length;
              this.LastSensorTemp = new Date(
                this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time
              );
              this.DataTimePath = this.CurrentSensor.data;
              this.TableOneDataPath = this.CurrentSensor.data;
              
              this.SensorOneType = "Gaz Sensor Value";

            
              break;
            
            case "AN-304C":
              this.SensorLength = this.CurrentSensor.data.length;
              this.LastSensorTemp = new Date(
                this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time
              );
              this.DataTimePath = this.CurrentSensor.data;
              this.TableOneDataPath = this.CurrentSensor.data;
              this.TableTwoDataPath = this.CurrentSensor.data;

              
              this.SensorOneType = "Sensor Status";
              this.SensorTwoType = "switch status";

              


            
              break;

              case "AN-301":
              this.SensorLength = this.CurrentSensor.data.length;
              this.LastSensorTemp = new Date(
                this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time
              );
              this.DataTimePath = this.CurrentSensor.data;
              this.TableOneDataPath = this.CurrentSensor.data;
              this.TableTwoDataPath = this.CurrentSensor.data;

              
              this.SensorOneType = "Alarm State";
              this.SensorTwoType = "State Dismantling";

              


            
              break;

          default:
            console.log("no device selected");
        }

        const DD =
          DDD.getMonth() * 1000 +
          DDD.getFullYear() * 10000 +
          DDD.getDay() * 100;

        const DF =
          DFF.getMonth() * 1000 +
          DFF.getFullYear() * 10000 +
          DFF.getDay() * 100;
        const TT =
          OD.getMonth() * 1000 + OD.getFullYear() * 10000 + OD.getDay() * 100;

        let i = 0;

        for (i = 0; i < this.SensorLength - 1; i++) {
          let min;
          const DataDate = new Date(this.DataTimePath[i].time);//pour triphase: temps mta3 positive triphase 
          console.log("DataDate: " + DataDate);
          const TD =
            DataDate.getMonth() * 1000 +
            DataDate.getFullYear() * 10000 +
            DataDate.getDay() * 100;
          const Did = TD - TT;
          const DICD = TD - DD;
          const DICF = TD - DF;

          const CurentDate = new Date(Date.now());

          if (
            (DataDate.getTime() >= DDD.getTime() &&
              DataDate.getTime() <= DFF.getTime()) ||
            (OD.getDay() == DataDate.getDay() &&
              OD.getMonth() == DataDate.getMonth() &&
              OD.getFullYear() == DataDate.getFullYear())
          ) {
            DataDate.getMinutes() > 10
              ? (min = DataDate.getMinutes())
              : (min = "0" + DataDate.getMinutes());

            this.label.push( //pour triphase bch ypushi temps mt3 positive triphase  
              DataDate.getFullYear() +
                "/" +
                (DataDate.getMonth() + 1) +
                "/" +
                DataDate.getDate() +
                " , " +
                DataDate.getHours() +
                ":" +
                min +
                " "
            );

            switch (this.CurrentSensor.type) {
              case "Sensor":
                this.ExcelItem = {
                  SensorName: this.CurrentSensor.name,
                  Type: this.CurrentSensor.type,
                  Temperature: this.TableOneDataPath[i].tempValues,
                  Humidity: this.TableTwoDataPath[i].humValues,

                  Date:
                    DataDate.getFullYear() +
                    "/" +
                    (DataDate.getMonth() + 1) +
                    "/" +
                    DataDate.getDate() +
                    " , " +
                    DataDate.getHours() +
                    ":" +
                    min +
                    " "
                };
                this.datasetToExcel.push(this.ExcelItem);
                this.DataTableOne.push(this.TableOneDataPath[i].tempValues);
                this.DataTableTwo.push(this.TableTwoDataPath[i].humValues);
                break;
              case "AN-103A":
                this.ExcelItem = {
                  SensorName: this.CurrentSensor.name,
                  Type: this.CurrentSensor.type,
                  Temperature: this.TableOneDataPath[i].tempValues,
                  Humidity: this.TableTwoDataPath[i].humValues,

                  Date:
                    DataDate.getFullYear() +
                    "/" +
                    (DataDate.getMonth() + 1) +
                    "/" +
                    DataDate.getDate() +
                    " , " +
                    DataDate.getHours() +
                    ":" +
                    min +
                    " "
                };
                this.datasetToExcel.push(this.ExcelItem);
                this.DataTableOne.push(this.TableOneDataPath[i].tempValues);
                this.DataTableTwo.push(this.TableTwoDataPath[i].humValues);
                break;
                case "AN-303":
                this.ExcelItem = {
                  SensorName: this.CurrentSensor.name,
                  Type: this.CurrentSensor.type,
                  Temperature: this.TableOneDataPath[i].tempValues,
                  Humidity: this.TableTwoDataPath[i].humValues,

                  Date:
                    DataDate.getFullYear() +
                    "/" +
                    (DataDate.getMonth() + 1) +
                    "/" +
                    DataDate.getDate() +
                    " , " +
                    DataDate.getHours() +
                    ":" +
                    min +
                    " "
                };
                this.datasetToExcel.push(this.ExcelItem);
                this.DataTableOne.push(this.TableOneDataPath[i].tempValues);
                this.DataTableTwo.push(this.TableTwoDataPath[i].humValues);
                break;

                case "AN-305A":
                this.ExcelItem = {
                  SensorName: this.CurrentSensor.name,
                  Type: this.CurrentSensor.type,
                  Door_Status : this.TableOneDataPath[i].DoorContactStatus,
                  

                  Date:
                    DataDate.getFullYear() +
                    "/" +
                    (DataDate.getMonth() + 1) +
                    "/" +
                    DataDate.getDate() +
                    " , " +
                    DataDate.getHours() +
                    ":" +
                    min +
                    " "
                };
                this.datasetToExcel.push(this.ExcelItem);
                this.DataTableOne.push(this.TableOneDataPath[i].DoorContactStatus);
                break;



                case "AN-302":
                  this.ExcelItem = {
                    SensorName: this.CurrentSensor.name,
                    Type: this.CurrentSensor.type,
                    "gaz sensor value": this.TableOneDataPath[i].SensorValue,
                    
  
                    Date:
                      DataDate.getFullYear() +
                      "/" +
                      (DataDate.getMonth() + 1) +
                      "/" +
                      DataDate.getDate() +
                      " , " +
                      DataDate.getHours() +
                      ":" +
                      min +
                      " "
                  };
                  this.datasetToExcel.push(this.ExcelItem);
                  this.DataTableOne.push(this.TableOneDataPath[i].SensorValue);
                  break;

                case "AN-304C":
                  this.ExcelItem = {
                    SensorName: this.CurrentSensor.name,
                    Type: this.CurrentSensor.type,
                    Sensor_Status: this.TableOneDataPath[i].SensorStatus,
                    Anti_dismantle_switch_status: this.TableTwoDataPath[i].SwitchStatus,


                    Date:
                      DataDate.getFullYear() +
                      "/" +
                      (DataDate.getMonth() + 1) +
                      "/" +
                      DataDate.getDate() +
                      " , " +
                      DataDate.getHours() +
                      ":" +
                      min +
                      " "
                  };
                  this.datasetToExcel.push(this.ExcelItem);
                  this.DataTableOne.push(this.TableOneDataPath[i].SensorStatus);
                  this.DataTableTwo.push(this.TableOneDataPath[i].SwitchStatus);

                  break;

                  case "AN-301":
                    this.ExcelItem = {
                      SensorName: this.CurrentSensor.name,
                      Type: this.CurrentSensor.type,
                      Alarm_state: this.TableOneDataPath[i].AlarmState,
                      State_of_dismantling: this.TableTwoDataPath[i].StateDismantling,
  
  
                      Date:
                        DataDate.getFullYear() +
                        "/" +
                        (DataDate.getMonth() + 1) +
                        "/" +
                        DataDate.getDate() +
                        " , " +
                        DataDate.getHours() +
                        ":" +
                        min +
                        " "
                    };
                    this.datasetToExcel.push(this.ExcelItem);
                    this.DataTableOne.push(this.TableOneDataPath[i].AlarmState);
                    this.DataTableTwo.push(this.TableOneDataPath[i].StateDismantling);
  
  
                    break;

              case "mono":
                D1 =
                  this.TableOneDataPath[i + 1].PositiveActiveTotalEnergy - D1;
                D2 = this.TableOneDataPath[i + 1].ReverseActiveTotalEnergy - D2;

                this.Courant = this.TableOneDataPath[i].current;
                this.ExcelItem = {
                  SensorName: this.CurrentSensor.name,
                  Type: this.CurrentSensor.type,
                  Consumption: D1 + "KW",
                  Production: D2 + "KW",
                  PositiveActiveTotalEnergy:
                    this.TableOneDataPath[i].PositiveActiveTotalEnergy + "KWh",
                  ReverseActiveTotalEnergy:
                    this.TableOneDataPath[i].ReverseActiveTotalEnergy + "KWh",
                  ActivePower: this.TableOneDataPath[i].ActivePower,
                  PowerFactor: this.TableOneDataPath[i].PowerFactor,

                  Voltage: this.TableOneDataPath[i].Voltage + "V",
                  ComActiveTotalEnergy:
                    this.TableOneDataPath[i].ComActiveTotalEnergy + "kwh",
                  PowerGridFrequency:
                    this.TableOneDataPath[i].PowerGridFrequency + "Hz",
                  courant: this.TableOneDataPath[i].Current + "A",

                  Date:
                    DataDate.getFullYear() +
                    "/" +
                    (DataDate.getMonth() + 1) +
                    "/" +
                    DataDate.getDate() +
                    " , " +
                    DataDate.getHours() +
                    ":" +
                    min +
                    " "
                };

                this.datasetToExcel.push(this.ExcelItem);
                this.DataTableOne.push(
                  this.TableOneDataPath[i].ActivePower
                ); //D1*6
               

                break;

              case "triphase":
                

                D3 = this.TableOneDataPath[i + 1].PositiveActiveTotal - D3;
                D4 = this.TableTwoDataPath[i + 1].ReverseActiveTotal - D4;
                
               

                this.ExcelItem = {
                  SensorName: this.CurrentSensor.name,
                  Type: this.CurrentSensor.type,
                  Consumption: D3 + "KW",
                  Production: D4 + "KW",
                  PositiveActiveTotalEnergy:
                    this.TableOneDataPath[i].PositiveActiveTotal + "KWh",
                  ReverseActiveTotalEnergy:
                    this.TableTwoDataPath[i].ReverseActiveTotal + "KWh",
                    "":"",
                  ActivePowerTotal: this.Table3[i].ActivePowerTotal + "Kw",
                  ActivePowerPhaseA: this.Table3[i].ActivePowerPhaseA + "Kw",
                  ActivePowerPhaseB: this.Table3[i].ActivePowerPhaseB + "Kw",
                  PowerFactorTotal: this.Table3[i].PowerFactorTotal,
                  PowerFactorPhaseA: this.Table3[i].PowerFactorPhaseA,
                  PowerFactorPhaseB: this.Table3[i].PowerFactorPhaseB,
                  " ":"",

                  ComActiveTotal: this.Table4[i].ComActiveTotal,
                  "  ":"",

                  VoltagePhaseA: this.Table5[i].VoltagePhaseA + "V",
                  VoltagePhaseB: this.Table5[i].VoltagePhaseB + "V",
                  CurrentPhaseA: this.Table5[i].CurrentPhaseA + "A",
                  CurrentPhaseB: this.Table5[i].CurrentPhaseB + "A",

                  Date:   //  date mta3 positive triphase 
                    DataDate.getFullYear() +
                    "/" +
                    (DataDate.getMonth() + 1) +
                    "/" +
                    DataDate.getDate() +
                    " , " +
                    DataDate.getHours() +
                    ":" +
                    min +
                    " "
                };
                this.datasetToExcel.push(this.ExcelItem);
                this.DataTableOne.push(
                  this.Table3[i].ActivePowerTotal 
                ); //D3
             

                break;
              case "WaterMeter":

                this.ExcelItem = {
                  SensorName: this.CurrentSensor.name,
                  Type: this.CurrentSensor.type,
                  Water_Data: this.TableOneDataPath[i].Water_data,
                  Date:
                    DataDate.getFullYear() +
                    "/" +
                    (DataDate.getMonth() + 1) +
                    "/" +
                    DataDate.getDate() +
                    " , " +
                    DataDate.getHours() +
                    ":" +
                    min +
                    " "
                };
                this.datasetToExcel.push(this.ExcelItem);
                this.DataTableOne.push(this.TableOneDataPath[i].Water_data);


                break;
              case "smoke":
                

                this.ExcelItem = {
                  SensorName: this.CurrentSensor.name,
                  Type: this.CurrentSensor.type,
                  State: this.TableOneDataPath[i].state,
                  Date:
                    DataDate.getFullYear() +
                    "/" +
                    (DataDate.getMonth() + 1) +
                    "/" +
                    DataDate.getDate() +
                    " , " +
                    DataDate.getHours() +
                    ":" +
                    min +
                    " "
                };
                this.datasetToExcel.push(this.ExcelItem);
                if (this.TableOneDataPath[i].state == "1") {
                  this.DataTableOne.push(this.TableOneDataPath[i].state);
                }
                break;
              default:
                console.log("no device selected");
            }
          }
        }
        console.log(this.label);

        console.log("SensorValue1: " + this.DataTableOne);
        console.log("SensorValue2: " + this.DataTableTwo);

        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;

          if (this.CurrentSensor.type == "smoke") {
            this.data = {
              labels: this.label,
              datasets: [
                {
                  data: this.DataTableOne,
                  label: this.SensorOneType,
                  backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                  borderColor: colors.primary
                } /* {
              data: this.DataTableThree,
              label: this.SensorThreeType,
              backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
              borderColor: colors.info,
            },*/
              ]
            };
            
          } else if (this.CurrentSensor.type == "mono") {
            this.data = {
              labels: this.label,
              datasets: [
                {
                  data: this.DataTableOne,
                  label: this.SensorOneType,
                  backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                  borderColor: colors.primary
                } /* {
              data: this.DataTableThree,
              label: this.SensorThreeType,
              backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
              borderColor: colors.info,
            },*/
              ]
            };
          }
         else if (this.CurrentSensor.type == "triphase") {
            this.data = {
              labels: this.label,
              datasets: [
                {
                  data: this.DataTableOne,
                  label: this.SensorOneType,
                  backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                  borderColor: colors.primary
                } /* {
              data: this.DataTableThree,
              label: this.SensorThreeType,
              backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
              borderColor: colors.info,
            },*/
              ]
            };
          }
         else if (this.CurrentSensor.type == "WaterMeter") {
            this.data = {
              labels: this.label,
              datasets: [
                {
                  data: this.DataTableOne,
                  label: this.SensorOneType,
                  backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                  borderColor: colors.primary
                } /* {
              data: this.DataTableThree,
              label: this.SensorThreeType,
              backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
              borderColor: colors.info,
            },*/
              ]
            };
          }
          else {
            this.data = {
              labels: this.label,
              datasets: [
                {
                  data: this.DataTableOne,
                  label: this.SensorOneType,
                  backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                  borderColor: colors.primary
                },
                {
                  data: this.DataTableTwo,
                  label: this.SensorTwoType,
                  backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
                  borderColor: colors.danger
                } /* {
                data: this.DataTableThree,
                label: this.SensorThreeType,
                backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
                borderColor: colors.info,
              },*/
              ]
            };
          }

          this.options = {
            responsive: true,
            scale: {
              ticks: {
                beginAtZero: true
              }
            }
          };
        });
      });
      console.log("dateFin: " + this.dateDebut + "  dateFin: " + this.dateFin);
    }
  }

  constructor(
    private theme: NbThemeService,
    private BindingDataService: DashService
  ) {}
  clearTable() {
    this.label = [];
    this.DataTableOne = [];
    this.DataTableTwo = [];
    this.DataTableThree = [];
    this.TableOneDataPath = [];
    this.TableThreeDataPath = [];
    this.CurrentSensor = null;
    this.datasetToExcel = [];
    // this.SensorSelected="ok";
  }

  ngOnDestroy(): void {
    //  this.themeSubscription.unsubscribe();
  }

  fct(): void {
    this.BindingDataService.exportAsExcelFile(this.datasetToExcel, "Dataset");
  }
}