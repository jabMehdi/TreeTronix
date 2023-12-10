import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Factory } from '../../model/factory';
import {Sensor} from '../../model/sensor';
import {Alert} from '../../model/alert';

@Component({
  selector: 'ngx-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss'],
})
export class DashboardStatsComponent implements OnInit {
  numberOfFactories: number;
  numberOfDevices: number;
  numberOfAlerts: number;
  sensorCode: string;
  factoryListVisible: boolean = false;
  DeviceListVisible: boolean = false;
  AlertListVisible: boolean = false;
  data: Array<Factory>;
  data1: Array<Sensor>;
  data2: Array<Alert>;

  options = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit()
  {

    this.http.post('http://localhost:4200/api/factories/factory/nbF', {}, this.options).subscribe((data: any) => {
      this.numberOfFactories = data.count;
    });
    
    this.http.post('http://localhost:4200/api/sensors/sensor/nbS', {}, this.options).subscribe((data: any) => {
      this.numberOfDevices = data.count;
    });

    this.http.post('http://localhost:4200/api/alerts/alert/nbA', {}, this.options).subscribe((data: any) => {
      this.numberOfAlerts = data.count;
    });
    this.getFactoryData();
    this.getDeviceData();
    this.getAlertData();
  }
  
goToFactoryPage() {
    // Navigate to the profile page using the router
    this.router.navigate(['pages/mapbox']);
}
goToDevicePage() {
  // Navigate to the profile page using the router
  this.router.navigate(['pages/s-devices']);
}
goToAlertPage() {
  // Navigate to the profile page using the router
  this.router.navigate(['pages/alert']);
}

toggleFactoryList() {
  // Toggle the visibility of the factory list
  this.factoryListVisible = !this.factoryListVisible;
}
toggleDeviceList() {
  // Toggle the visibility of the factory list
  this.DeviceListVisible = !this.DeviceListVisible;
}
toggleAlertList() {
  // Toggle the visibility of the factory list
  this.AlertListVisible = !this.AlertListVisible;
}

getFactoryData() {
  this.http.post('/api/Factories/factory/ByUser', {}, this.options).subscribe((data: any) => {
    this.data = data; // Set the retrieved data to the 'data' variable
    this.data.forEach(item => {
      item.nbrSensor = item.sensorsId.length;
    });
  });
}

getDeviceData() {
  this.http.post('/api/sensors/sensor/findByUser', {}, this.options).subscribe((data: any) => {
    this.data1 = data; // Set the retrieved data to the 'deviceData' variable

  });
}


getAlertData() {
  this.http.post('/api/alerts/alert/getByUser', {}, this.options).subscribe((data: any) => {
    this.data2 = data; // Set the retrieved data to the 'deviceData' variable
  });
}

}
