import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-decoder',
  templateUrl: './decoders.component.html',
  styleUrls: ['./decoders.component.scss']
})
export class DecodersComponent implements OnInit {
  sensorCode: string;
  sensorData: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  ngOnInit(): void {
    console.log('DecodersComponent initialized');
    this.route.paramMap.subscribe(params => {
      this.sensorCode = params.get('code'); // Update to 'code'
      const sensorId = params.get('sensorId'); // Update to 'id'
      this.getSensorData(sensorId);
    });
  }
  

  getSensorData(sensorId: string): void {
    console.log(this.sensorCode);
    console.log(sensorId);
    if (sensorId) {
      this.http.post<any[]>(`/api/sensors/sensor/data/${this.sensorCode}/${sensorId}`, {})
        .subscribe(
          (data: any[]) => {
            this.sensorData = data;
           // Log the received data
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }
  
  
}
