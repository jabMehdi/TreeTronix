import {Component} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DashService} from '../../dashboard/dash.service';
import any = jasmine.any;


@Component({
  selector: 'ngx-chartjs',
  styleUrls: ['./chartjs.component.scss'],
  templateUrl: './chartjs.component.html',
})
export class ChartjsComponent {
  fileName= 'ExcelSheet.xlsx'; 
  private Sdata = [];
  private factoryData=[];
  private token;
  private devices;
  options = [];
  options2 = [];
  places: {};
  selectedFactory: any = 'ok';
  selectedZone: any = 'ok';
  selectedDevice: any = 'ok';
  findFactoryByuser = '/api/Factories/factory/ByUser';
  selectedOption: any = 'ok';
  selectedChart: string;

  constructor(private http: HttpClient, private  service: DashService) {
    this.token = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };
  
    this.http.post('/api/sensors/sensor/findByType',
      {
        type: 'Sensor',
      }, this.token).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      this.Sdata = resJSON;
    });
    //findFactoryByUser
    this.http.post(this.findFactoryByuser,
    {}, this.token).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.factoryData = resJSON;
    console.log("factoryData: "+this.factoryData);
    
  });
  //selectZoneByFactory
  
  }
 
  selectZone(){
    this.http.post('/api/Factories/factory/placeByFactory', {id : this.selectedFactory},
  this.token).subscribe(data => {
  const resSTR = JSON.stringify(data);
  const resJSON = JSON.parse(resSTR);
  this.options2 = resJSON;
  console.log("selectedFactory: "+ this.selectedFactory)
   this.places = this.options2[0].place ;
   console.log("places: "+ this.places)
 // console.log(' click place'  , this.options2[0].place);

});

  }
  selectDevice(){
    this.http.post('/api/sensors/sensor/byArea', {area : this.selectedZone,},
    this.token).subscribe(data => {
    const resSTR = JSON.stringify(data);
    const resJSON = JSON.parse(resSTR);
    this.devices=resJSON;

    //this.service.DataStat(this.selectedDevice);
    
    console.log("device by zone: "+ this.devices[0].name);
    

   // console.log(' click place'  , this.options2[0].place);
  
  });

  
  }
  
  send() {
    localStorage.setItem('selectedDevice', JSON.stringify(this.selectedDevice));

    console.log("testtttttttttttttttttttttttttttttttttttt: "+ this.selectedDevice)
    this.service.DataStat(this.selectedDevice);

  }
  showChart(chartType: string) {
    this.selectedChart = chartType;
  }


}
