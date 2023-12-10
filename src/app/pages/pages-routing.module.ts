import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import {SDevicesComponent} from './s-devices/s-devices.component';
import { MapboxComponent } from './mapbox/mapbox.component';
import {AddsensorComponent} from './addsensor/addsensor.component';
import {AddfactoryComponent} from './factory/addfactory/addfactory.component';
import {AllfactoryComponent} from './factory/allfactory/allfactory.component';
import {ReclamationComponent} from './reclamation/reclamation.component';
import {StatComponent} from './stat/stat.component';
import {HistoryComponent} from './history/history.component';
import {NgxAlertComponent} from './Alert/alert.compoent';
import {ChatComponent} from './chat/chat.component';
import {PlaceComponent} from './factory/place/place.component';

import {FactureComponent} from './facture/facture.component'
import { DecodersComponent } from './decoders/decoders.component';
import { PredictionComponent } from './predictions/predictions.component';
import { LicenseComponent } from './license/license.component';
import { LicenseResolver } from './license-guard/license.resolver';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent, 
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },    {
      path: 'place',
      component: PlaceComponent,
      resolve: { license: LicenseResolver },
    },
    {
      path: 'license',
      component: LicenseComponent,
    },
    
    { path: 'decoders/:code/:sensorId', component: DecodersComponent,resolve: { license: LicenseResolver }, },

    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 's-devices',
      component: SDevicesComponent,
      resolve: { license: LicenseResolver },
      
    },
    {
      path: 'Prediction',
      component: PredictionComponent,
      resolve: { license: LicenseResolver },
      
     }, {
      path: 'chat',
      component: ChatComponent,
    },
    {
      path: 'addsensor',
      component: AddsensorComponent,

    },
    {
      path: 'stat',
      component: StatComponent,
    },
    {
      path: 'mapbox',
      component: MapboxComponent,
      resolve: { license: LicenseResolver },
    },
    {
      path: 'addfactory',
      component: AddfactoryComponent,
      
    },
    {
      path: 'allfactory',
      component: AllfactoryComponent,
      resolve: { license: LicenseResolver },
    },
    {
      path: 'reclamation',
      component: ReclamationComponent,  
    },
    {
      path: 'alert',
      component: NgxAlertComponent,
      resolve: { license: LicenseResolver }, },
      {
        path: 'facture',
        component: FactureComponent },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },

    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
        resolve: { license: LicenseResolver },
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },

    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
