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
import { TarifComponent } from './tarif/tarif.component';
import {FactureComponent} from './facture/facture.component'
import { DecodersComponent } from './decoders/decoders.component';

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
    },
    
    { path: 'decoders/:code/:sensorId', component: DecodersComponent },

    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 's-devices',
      component: SDevicesComponent,
    },

    {
      path: 'price',
      component: TarifComponent,
    },  {
      path: 'chat',
      component: ChatComponent,
    },
    {
      path: 'Price',
      component: TarifComponent,
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
    },
    {
      path: 'addfactory',
      component: AddfactoryComponent,
    },
    {
      path: 'allfactory',
      component: AllfactoryComponent,
    },
    {
      path: 'reclamation',
      component: ReclamationComponent,
    },
    {
      path: 'alert',
      component: NgxAlertComponent  },
      {
        path: 'facture',
        component: FactureComponent  },
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
