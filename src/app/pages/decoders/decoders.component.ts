import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { isNumber, reverse, sortBy,isNaN } from 'lodash';


@Component({
  selector: 'app-decoder',
  templateUrl: './decoders.component.html',
  styleUrls: ['./decoders.component.scss']
})
export class DecodersComponent implements OnInit {
  sensorCode: string;
  sensorData: any;
  sortedColumn: string;
  isSortReversed: boolean;

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
  
 

  sortColumn(column: string): void {
    if (this.sortedColumn === column) {
      this.isSortReversed = !this.isSortReversed;
      this.sensorData = this.isSortReversed ? reverse(this.sensorData) : sortBy(this.sensorData, [column]);
    } else {
      this.sortedColumn = column;
      this.isSortReversed = false;
  
      if (column === 'tempValues' || column === 'humValues') {
        this.sensorData = sortBy(this.sensorData, [(data) => parseFloat(data[column])]);
      } else {
        this.sensorData = sortBy(this.sensorData, [column]);
      }
    }
  }
  
  
  
    
}
