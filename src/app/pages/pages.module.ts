import { NgModule } from '@angular/core';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbChatModule,
  NbInputModule,
  NbMenuModule,
  NbRadioModule,
  NbSelectModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

import { SDevicesComponent } from './s-devices/s-devices.component';
import { MapboxComponent } from './mapbox/mapbox.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AddsensorComponent } from './addsensor/addsensor.component';
import { AddfactoryComponent } from './factory/addfactory/addfactory.component';
import { AllfactoryComponent } from './factory/allfactory/allfactory.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { StatComponent } from './stat/stat.component';

import { NgxAlertComponent } from './Alert/alert.compoent';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbAuthModule } from '@nebular/auth';
import { ChatComponent } from './chat/chat.component';
import { ExtraComponentsModule } from './extra-components/extra-components.module';
import { PlaceComponent } from './factory/place/place.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { TarifComponent } from './tarif/tarif.component';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { FactureComponent } from './facture/facture.component';
import { DecodersComponent } from './decoders/decoders.component';
import { DecoderButtonComponent } from './decode-button/decode-button.component';
import { NbIconModule } from '@nebular/theme';
import { DeleteDataButtonComponent } from './delete-data-button/delete-data-button.component' ;


@NgModule({
  declarations: [
    PagesComponent,
    SDevicesComponent,
    MapboxComponent,
    AddsensorComponent,
    AddfactoryComponent,
    AllfactoryComponent,
    ReclamationComponent,
    StatComponent,
    NgxAlertComponent,
    ChatComponent,
    PlaceComponent,
    TarifComponent,
    DecodersComponent,
    FactureComponent,
    DecoderButtonComponent,
    DeleteDataButtonComponent,
  ],
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbIconModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbAuthModule,
    NbCardModule,
    NbChatModule,
    ExtraComponentsModule,
    UiSwitchModule,
    AngularDateTimePickerModule,
  ],
  entryComponents: [DeleteDataButtonComponent, DecoderButtonComponent,]
})
export class PagesModule {}
