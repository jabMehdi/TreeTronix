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
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  paginatedData: any[];


  constructor(private http: HttpClient, private route: ActivatedRoute) { this.currentPage = 1;
    this.itemsPerPage = 20; }
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
      // Check if the sensorCode is for the 'triphase' sensor
      if (this.sensorCode === "004A77012404D2C0") {
        console.log("triphase detected !")
        this.http.post<any[]>(`/api/sensors/sensor/data/${this.sensorCode}/${sensorId}`, {})
          .subscribe(
            (ConsomationTripahse: any[]) => {
              // For the 'triphase' sensor, use Countersdata
              this.sensorData = ConsomationTripahse; // Assuming 'Countersdata' is the correct property
              // Log the received data
              console.log("this is the data ",this.sensorData );
              this.totalItems = this.sensorData.length; // Set the total number of items
              this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calculate the total number of pages
              this.paginateData(); // Call the paginateData function to display the data for the current page
            },
            (error: any) => {
              console.error(error);
            }
          );
      } else {
        // For other sensors, use the standard 'sensorData'
        this.http.post<any[]>(`/api/sensors/sensor/data/${this.sensorCode}/${sensorId}`, {})
          .subscribe(
            (data: any[]) => {
              this.sensorData = data;
              // Log the received data
              this.totalItems = this.sensorData.length; // Set the total number of items
              this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calculate the total number of pages
              this.paginateData(); // Call the paginateData function to display the data for the current page
            },
            (error: any) => {
              console.error(error);
            }
          );
      }
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
    this.currentPage = 1;
    this.paginateData(); // Call the paginateData function after sorting the data
  }
  
  changePage(page: number): void {
    this.currentPage = page;
    this.paginateData();
  }
  
  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    // Check if the startIndex is within the valid range
    if (startIndex >= 0 && startIndex < this.totalItems) {
      // Slice the sensorData array based on the startIndex and endIndex
      this.paginatedData = this.sensorData.slice(startIndex, endIndex);
    } else {
      // If the startIndex is out of range or no data available, set the paginatedData to an empty array
      this.paginatedData = [];
    }
  }
  
  
  
}
