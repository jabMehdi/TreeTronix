// license.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LicenseService {
  private licenseStatus: string;

  constructor(private http: HttpClient) {}

  getLicenseStatus(): Observable<string> {
    // You can make an API call here to get the license status if needed
    // For simplicity, I'm returning an observable with the current status
    return of(this.licenseStatus);
  }

  setLicenseStatus(status: string): void {
    this.licenseStatus = status;
  }

  hasActiveLicense(): Observable<boolean> {
    // You should implement the logic here to fetch the license status from your backend
    // For now, I'm returning a mock value. Adjust this based on your actual implementation.
    return this.getLicenseStatus().pipe(
      map((status) => status === 'Active')
    );
  }
  // Add methods to interact with your backend and get license status
  // For example, make an HTTP request to your backend API
  // ...

  // Update the license status property based on the response from the backend
  // ...
}
