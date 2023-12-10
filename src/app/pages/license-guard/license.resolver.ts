// license.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LicenseService } from '../services/license.services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LicenseResolver implements Resolve<boolean> {
  constructor(private licenseService: LicenseService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.licenseService.hasActiveLicense().pipe(
      map((isLicenseActive) => {
        if (isLicenseActive) {
          return true;
        } else {
          this.router.navigate(['/dashboard']);
          console.log("helpz me habibi");
          return false;
        }
      })
    );
  }
}
