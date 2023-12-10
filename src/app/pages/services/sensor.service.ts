// sensor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private baseUrl = 'http://localhost:3007'; // Update with your actual server URL

  constructor(private http: HttpClient) { }

 // sensor.service.ts
findByCodeAndTest(sensorType: string, field: string): Observable<any> {
  const route = `${this.baseUrl}/api/sensors/sensor/findByCodeAndTest?type=${sensorType}&field=${field}`;
  return this.http.post(route, {}).pipe(
    tap(response => console.log('Response from server:', response)),
    catchError(error => {
      console.error('Error from server:', error);
      return throwError(error); // Rethrow the error after logging
    })
  );
}

findByCodeAndPred(sensorType: string, field: string, date: string): Observable<any> {
  const route = `${this.baseUrl}/api/sensors/sensor/findByCodeAndPred?type=${sensorType}&field=${field}`;
  return this.http.post(route, { date });
}

}
