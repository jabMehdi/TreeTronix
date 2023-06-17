import { Component, OnDestroy } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';
import { DashService } from 'd:/Projet/Usina/FrontEnd/Iot-Factory/src/app/pages/dashboard/dash.service';

const Swal = require('sweetalert2');
@Component({
  selector: 'ngx-chartjs-line',
  template:
    `
  <div>
    <div class="input-group col-md-11">
      <span class="input-group-addon">start date:</span>&nbsp;&nbsp;&nbsp;
      <angular2-date-picker [(ngModel)]="dateDebut" [settings]="settings"></angular2-date-picker>&nbsp;&nbsp;&nbsp;
      <span class="input-group-addon">Finish date:</span>&nbsp;&nbsp;&nbsp;
      <angular2-date-picker [(ngModel)]="dateFin" [settings]="settings"></angular2-date-picker>&nbsp;&nbsp;&nbsp;
      <span class="input-group-btn">&nbsp;&nbsp;
            <button type="button" value="Click" (click)="getDateValues()" id='btn' class="btn btn-info btn-flat"> ok </button>
          </span>
    </div>
  </div>
  <chart type="line" [data]="data" [options]="options"></chart>
`,
})
export class ChartjsLineComponent implements OnDestroy {
  data: any;
  options: any;
  themeSubscription: any;
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  DataTableOne = [];
  DataTableTwo = [];
  BatteryLevel = [];
  CurrentSensor;
  SensorLength;
  LastSensorTemp;
  DataTimePath;
  TableOneDataPath;
  TableTwoDataPath;
  SensorOneType;
  SensorTwoType;
 

  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'hh:mm dd-MM-yyyy',
    defaultOpen: false,
  };
  label = [];
  CurrentSensorData = []
  getDateValues() {
    this.clearTable();
    this.BindingDataService.dataMsg.subscribe(SensorReceived => {
      this.CurrentSensor = SensorReceived;
      console.log("SensorTypeReceived: " + this.CurrentSensor.type)
      
      if(this.CurrentSensor.type=="Sensor"){
         

        this.SensorLength=this.CurrentSensor.data.length;
       this.LastSensorTemp = new Date(this.CurrentSensor.data[this.CurrentSensor.data.length - 1].time);
       this.DataTimePath=this.CurrentSensor.data;
       this.TableOneDataPath=this.CurrentSensor.data;
       this.TableTwoDataPath=this.CurrentSensor.data;
       this.SensorOneType="Temperature";
       this.SensorTwoType="Humidity"
    
      }else if (this.CurrentSensor.type=="mono"){
 
     
        this.SensorLength=this.CurrentSensor.Countersdata.length;
        this.LastSensorTemp = new Date(this.CurrentSensor.Countersdata[this.CurrentSensor.Countersdata.length - 1].time);
        this.DataTimePath=this.CurrentSensor.Countersdata;
        this.TableOneDataPath=this.CurrentSensor.Countersdata;
       this.TableTwoDataPath=this.CurrentSensor.ActivePowerTipahse;
       this.SensorOneType="ReverseActiveTotalEnergy";
       this.SensorTwoType="Voltage";
        
      }
      let i = 0;
     
      console.log("lastDate: " + this.LastSensorTemp);

      for (i = 0; i < this.SensorLength; i++) {
        let min;
        const DataDate = new Date(this.DataTimePath[i].time);


        const DD = new Date(this.dateDebut)
        const DF = new Date(this.dateFin);
        const TD = DataDate.getTime();
        const CurentDate = new Date(Date.now());

        if (DD > DF || DF > CurentDate) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Time Interval is wrong ',
          })
        } else {
          if (DF > this.LastSensorTemp) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No data received at the selected data ',
            })

          }
          else {
            if ((TD >= DD.getTime() && TD <= DF.getTime()) || (TD == DF.getTime()) || (DF.getTime() == DD.getTime())) {

              DataDate.getMinutes() > 10 ?
                (min = DataDate.getMinutes()) : min = '0' + DataDate.getMinutes();
              this.label.push(DataDate.getFullYear() + '/' + DataDate.getDate()
                + '/' + (DataDate.getMonth() + 1) + ' , '
                + DataDate.getHours() + ':' + min + ' ');
            //  console.log("Date: " + this.label)
              if (this.CurrentSensor.type="Sensor"){
                this.DataTableOne.push(this.TableOneDataPath[i].tempValues);
                this.DataTableTwo.push(this.TableTwoDataPath[i].humValues);
              } if (this.CurrentSensor.type="mono"){
               // console.log("heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyynnnnnnnn!!!: "+this.CurrentSensor.Countersdata[0].ReverseActiveTotalEnergy)
              //    console.log("Countersdata!!!!!!!!!!!!!: "+ this.TableOneDataPath[i].ReverseActiveTotalEnergy)
                  this.DataTableOne.push(this.TableOneDataPath[i].ReverseActiveTotalEnergy);
                    
                  this.DataTableTwo.push(this.TableOneDataPath[i].Voltage
                    );

                }
              
            
              this.BatteryLevel.push(this.CurrentSensor.data[i].batteryLevel);
            }
          }

        }
      }


      console.log("SensorValue: " + this.DataTableOne)

      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        const colors: any = config.variables;
        const chartjs: any = config.variables.chartjs;


        this.data = {

          labels: this.label,
          datasets: [{
            data: this.DataTableOne,
            label: this.SensorOneType,
            backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
            borderColor: colors.primary,
          }, {
            data: this.DataTableTwo,
            label: this.SensorTwoType,
            backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
            borderColor: colors.danger,
          }, {
          data: this.BatteryLevel,
          label: 'Battery',
          backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
          borderColor: colors.info,
        },
          ],
        };

        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
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
          legend: {
            labels: {
              fontColor: chartjs.textColor,
            },
          },
        };
      });

    })
    console.log('dateFin: ' + this.dateDebut + "  dateFin: " + this.dateFin);
    const CurrentSensor = JSON.parse(localStorage.getItem('selectedDevice'));
    console.log("CurrentSensorDataFromLineChart: " + this.CurrentSensor.name);

  }


  constructor(private theme: NbThemeService, private BindingDataService: DashService) {

  }
  clearTable() {
    this.label = [];
    this.DataTableOne = []
    this.DataTableTwo=[]
    this.TableOneDataPath=[]
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
