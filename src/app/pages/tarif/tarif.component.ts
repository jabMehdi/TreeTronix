import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../auth/model/User';
import { Router, Data } from '@angular/router';
import { __values } from 'tslib';


import { DashService } from '../dashboard/dash.service';

const Swal = require('sweetalert2');
@Component({
  selector: 'ngx-tarif',
  templateUrl: './tarif.component.html',
  styleUrls: ['./tarif.component.scss']
})

export class TarifComponent implements OnInit {

  vmin11; vmin12; vmin13;
  vmin21; vmin22; vmin23;
  vmin31; vmin32; vmin33;
  vmin41; vmin42; vmin43;
  TotalOn="notOk"
  time1; time2; total:number=0
  Price24; time3; time4
  Price11; Price12; Price13;
  Price21; Price22; Price23;
  Price31; Price32; Price33;
  Price41; Price42; Price43;
  TarifNumber;
  InputNumber: number = 0;
  consumption;
  dateDebut: Date = null;
  dateFin: Date = null;
  dateD: Date = null;
  dateF: Date = null;
  CurrentSensor;
  SensorLength;
  LastSensorTemp;
  DataTimePath;
  TableOneDataPath;
  TableTwoDataPath;
  TableThreeDataPath;
  SensorOneType;
  SensorTwoType;
  SensorThreeType;
  SensorSelected: any = "notOk";
  FactureData = []
  DeviceByZone = [];
  FirstPeriodPos;
  FirstPeriodRev;
  SecondPeriodPos;
  SecondPeriodRev;
  ThirdPeriod = [];
  FourthPeriod = [];
  consumptionFirstPeriode=0;
  consumptionSecondPeriode=0;
  consumptionThirdPeriode=0;
  consumptionFourthPeriode=0;
  production=0;
  loadSpinner=false;
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'hh:mm dd-MM-yyyy',
    defaultOpen: false,
  };


  submitted = false;

  SenspiUrl = 'api/sensors/sensor/findByCode';
  UpdateUrl = '/api/sensors/sensor/updateSensor/';
  findFactoryByuser = 'api/Factories/factory/ByUser';

  constructor(private http: HttpClient, private router: Router, private dashService: DashService) {
    this.time1 = this.time2 = this.Price11 = this.Price12 =
      this.Price13 = this.Price21 = this.Price22 = this.Price23 = this.Price31 = this.Price32 =
      this.Price33 = this.Price41 = this.Price42 = this.Price43 =this.Price24= 0

  }

  CurrentUser = new User();
  ngOnInit() { }

  Arr = Array;
  num: number;
  DeviceSelectON: number = 0;
  SelectedFactory: any = "ok";
  SelectedZone: any = "ok";
  SelectedDevice: any = "ok";
  places: {};
  sensors: {};
  msg: string;
  check: boolean = true;

  option = { params: new HttpParams().append('token', localStorage.getItem('token')), };
  options = [];
  options2 = [];
  options3 = [];
  test = this.http.post(this.findFactoryByuser, {},
    this.option).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      this.options = resJSON;

    });



  place() {
    this.SelectedZone = null;
    this.SelectedDevice = "Devices";
    this.DeviceSelectON = 0;
    this.DeviceByZone = [];
    this.http.post('api/Factories/factory/placeByFactory', { id: this.SelectedFactory },
      this.option).subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.options2 = resJSON;

        this.places = this.options2[0].place;


      });

  }

  send() {

    this.http.post('/api/sensors/sensor/byArea', { area: this.SelectedZone },
      this.option).subscribe(data => {
        this.DeviceByZone = [];
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.options3 = resJSON;
        this.options3.forEach(element => {
          console.log("Devices By Zone: " + element.name)
          if (element.type != "Sensor")
            this.DeviceByZone.push(element);

        });


      });
    this.SelectedDevice = "Devices"
    this.DeviceSelectON = 0
  }



  CalculTotal() {
    this.total=0
    let vmin1 = 0, vmin2 = 0, vmin3 = 0, Price1 = 0, Price2 = 0, Price3 = 0;
    switch (this.SelectedDevice.type) {
      case "mono":
        vmin1 = this.vmin11; vmin2 = this.vmin12; vmin3 = this.vmin13; Price1 = this.Price11; Price2 = this.Price12, Price3 = this.Price13
        break;
      case "WaterMeter":
        vmin1 = this.vmin31; vmin2 = this.vmin32; vmin3 = this.vmin33; Price1 = this.Price31; Price2 = this.Price32, Price3 = this.Price33
        break;
    }
    let tot = 0;
    if (this.SelectedDevice.type == "mono" || this.SelectedDevice.type == "WaterMeter") {

      if (this.consumption > vmin2) {
        tot += (this.consumption - vmin2) * Price3;
        tot += ((vmin2 - vmin1) * Price2)
        tot += (vmin1 * Price1)
      }

      else if (this.consumption > vmin1 && this.consumption < vmin2) {
        tot += (this.consumption - vmin1) * Price2;
        tot += (vmin1 * Price1)
      }
      else if (this.consumption <= vmin1) {
        console.log("consumption < price1")
        tot += (this.consumption * Price1)
        this.total=tot
        console.log("tot: "+tot)
      }



    } else if (this.SelectedDevice.type == "triphase") {
      console.log("consumptionFirstPeriode: "+this.consumptionFirstPeriode * this.Price21)
      console.log("2: "+this.consumptionSecondPeriode * this.Price22 )
      console.log("3: "+  this.consumptionThirdPeriode * this.Price23)
      console.log("4: "+ this.consumptionFourthPeriode * this.Price24)
      this.total += this.consumptionFirstPeriode * this.Price21 + this.consumptionSecondPeriode * this.Price22 +
        this.consumptionThirdPeriode * this.Price23 + this.consumptionFourthPeriode * this.Price24

    }
    console.log("total:  " + this.total)
    return (this.total)

  }


  onSubmit() {


    if (this.dateDebut == null || this.dateFin == null) {
      Swal.fire({

        icon: 'error',
        title: 'Oops...',
        text: 'Please select a date'
      })

    } else {
      this.TotalOn="ok"
      this.CurrentSensor = this.SelectedDevice;
      switch (this.CurrentSensor.type) {


        case "mono":


          this.SensorLength = this.CurrentSensor.ActivePowerTipahse.length;
          this.LastSensorTemp = new Date(this.CurrentSensor.Countersdata[this.CurrentSensor.Countersdata.length - 1].time);
          this.DataTimePath = this.CurrentSensor.ActivePowerTipahse;
          this.TableOneDataPath = this.CurrentSensor.Countersdata;
          this.TableTwoDataPath = this.CurrentSensor.ActivePowerTipahse;
          this.consumption = 0;
          let i = 0, j = 0;
          var monTableau = [];
          for (i = 0; i < this.SensorLength - 1; i++) {
            const TD = new Date(this.DataTimePath[i].time)

            if (TD.getTime() >= this.dateD.getTime() && TD.getTime() <= this.dateF.getTime()) {
              console.log("test:   " + this.TableTwoDataPath);

              monTableau.push(this.TableTwoDataPath[i]);
              j += 1;

            }
         
          }
          if(j==0){
            Swal.fire({

              icon: 'info',
              title: 'Oops...',
              text: 'No data found , Please choose another date'
            })
          }else{
            console.log(monTableau[j - 1].ComActiveTotalEnergy)
            this.consumption = Number(monTableau[j - 1].ComActiveTotalEnergy) - Number(monTableau[0].ComActiveTotalEnergy)
            
          }
          
          break;
        case "triphase":
          this.SensorLength = this.CurrentSensor.PositiveTripahse.length;
          this.DataTimePath = this.CurrentSensor.PositiveTripahse;
          this.TableOneDataPath = this.CurrentSensor.PositiveTripahse;
          this.TableTwoDataPath = this.CurrentSensor.ReverserTipahse;
          this.FirstPeriodPos = this.SecondPeriodPos = 0
          this.FirstPeriodRev = this.SecondPeriodRev = 0

          let f = 0
          let s = 0;
          let fh = 0;
          let t = 0;
          for (let i = 0; i < this.SensorLength - 1; i++) {
            const TD = new Date(this.DataTimePath[i].time)
            const Datatime = TD.getHours() * 60 + TD.getMinutes();

            if (TD.getTime() >= this.dateD.getTime() && TD.getTime() <= this.dateF.getTime()) {
              if (Datatime >= this.time1 && Datatime < this.time2) {
                //    this.FirstPeriodPos=this.TableOneDataPath[i].PositiveActiveTotal 
                //  this.FirstPeriodRev=(this.TableTwoDataPath[i].ReverseActiveTotal -this.FirstPeriodRev)*6;
                this.FirstPeriodPos.push(this.TableOneDataPath[i]);
                f += 1;


              }
              else if (Datatime >= this.time2 && Datatime < this.time3) {
                this.SecondPeriodPos.push(this.TableOneDataPath[i]);
                s += 1;
                //this.SecondPeriodPos=(this.TableOneDataPath[i].PositiveActiveTotal -this.FirstPeriodPos)*6;
                //this.SecondPeriodRev=(this.TableTwoDataPath[i].ReverseActiveTotal -this.FirstPeriodRev)*6;


              }
              else if (Datatime >= this.time3 && Datatime < this.time4) {
                t += 1
                this.ThirdPeriod.push(this.TableOneDataPath[i])

              } else if (Datatime >= this.time4 && Datatime < this.time1) {
                fh += 1
                this.FourthPeriod.push(this.TableOneDataPath[i])

              }
            }
            if (f > 0) {
              this.consumptionFirstPeriode = Number(this.FirstPeriodPos[f - 1].PositiveActiveTotal) - Number(this.FirstPeriodPos[0].PositiveActiveTotal)
              if (s > 0) {
                this.consumptionSecondPeriode = Number(this.SecondPeriodPos[s - 1].PositiveActiveTotal) - Number(this.SecondPeriodPos[0].PositiveActiveTotal)
                if (t > 0) {
                  this.consumptionThirdPeriode = Number(this.ThirdPeriod[t - 1].PositiveActiveTotal) - Number(this.ThirdPeriod[0].PositiveActiveTotal)
                  if (fh > 0) {
                    this.consumptionFourthPeriode = Number(this.FourthPeriod[fh - 1].PositiveActiveTotal) - Number(this.FourthPeriod[0].PositiveActiveTotal)
                  }
                }
              }
            }else{
              Swal.fire({

                icon: 'info',
                title: 'Oops...',
                text: 'No data found , Please choose another date'
              })
            }


            this.consumption= this.consumptionFirstPeriode+this.consumptionSecondPeriode+this.consumptionThirdPeriode +  this.consumptionFourthPeriode
            


          }




          break;

        case "WaterMeter":
          this.SensorLength = this.CurrentSensor.Countersdata.length;
          this.LastSensorTemp = new Date(this.CurrentSensor.Countersdata[this.CurrentSensor.Countersdata.length - 1].time);
          this.DataTimePath = this.CurrentSensor.Countersdata;
          this.TableOneDataPath = this.CurrentSensor.Countersdata;
          this.TableTwoDataPath = this.CurrentSensor.PositiveTripahse;

          this.SensorOneType = "Water_data";

          this.consumption = 0;
          let jw = 0;
          var monTableau = [];
          for (let i = 0; i < this.SensorLength; i++) {
            const TDw = new Date(this.DataTimePath[i].time)

            if (TDw.getTime() >= this.dateD.getTime() && TDw.getTime() <= this.dateF.getTime()) {
              monTableau.push(this.TableOneDataPath[i]);
              jw += 1
            }
            this.consumption = Number(monTableau[jw - 1].Water_data) - Number(monTableau[0].Water_data)
          }




          break;

        default: console.log("no device selected")

      }
      this.FactureData.push(this.CurrentSensor.name)
      this.FactureData.push(this.CurrentSensor.type)
      this.FactureData.push(this.Price21)
      this.FactureData.push(this.Price22)
      this.FactureData.push(this.consumption)
      this.FactureData.push(this.production)
      this.FactureData.push(this.dateD)
      this.FactureData.push(this.dateF)
      this.FactureData.push(this.time1)
      this.FactureData.push(this.time2)


      console.log("consumption: !!!" + this.consumption)
      console.log("test! " + this.FactureData[0])


      Swal.fire({

        icon: 'info',
        title: 'Total Price:  ' + this.CalculTotal(),
        text: 'Total Energy Consumption:' + this.consumption + " Total Energy produced: " + this.production
      })
      this.FactureData.push(this.total)
      this.FactureData.push(this.vmin11)
      this.FactureData.push(this.vmin12)
      this.FactureData.push(this.Price11)
      this.FactureData.push(this.Price12)
      this.FactureData.push(this.Price13)
      this.FactureData.push(this.consumptionFirstPeriode)
      this.FactureData.push(this.consumptionSecondPeriode)
      this.FactureData.push(this.consumptionThirdPeriode)
      this.FactureData.push(this.consumptionFourthPeriode)
      this.FactureData.push(this.time3)
      this.FactureData.push(this.time4)
      this.FactureData.push(this.Price23)
      this.FactureData.push(this.Price24)
      console.log("vmin11: " + this.vmin11)
      console.log("vmin12: " + this.vmin12)

   

      this.dashService.FactureStat(this.FactureData)
    }



  }
  getConsumption() {

    this.dateD = new Date(this.dateDebut);
    this.dateF = new Date(this.dateFin);
    this.SensorSelected = "ok"
    if (this.dateD.getTime() > this.dateF.getTime()) {


      Swal.fire({

        icon: 'error',
        title: 'Oops...',
        text: 'Wrong interval!'
      })

    }



  }

  DeviceOn() {

    this.vmin11 = this.vmin12 = this.vmin13 = null
    this.time1 = this.time2 = null

    if (this.SelectedDevice.type == "mono") this.DeviceSelectON = 1
    else if (this.SelectedDevice.type == "triphase") this.DeviceSelectON = 2
    else if (this.SelectedDevice.type == "WaterMeter") this.DeviceSelectON = 3
    else if (this.SelectedDevice.type == "GasMeter") this.DeviceSelectON = 4


  }

}