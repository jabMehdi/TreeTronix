import { NgModule } from "@angular/core";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbCheckboxModule,
  NbProgressBarModule,
  NbToggleModule
} from "@nebular/theme";
import { NgxEchartsModule } from "ngx-echarts";
import { ThemeModule } from "../../@theme/theme.module";
import { DashboardComponent } from "./dashboard.component";
import { StatusCardComponent } from "./status-card/status-card.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { RoomsComponent } from "./rooms/rooms.component";
import { RoomSelectorComponent } from "./rooms/room-selector/room-selector.component";
import { TemperatureComponent } from "./temperature/temperature.component";
import { TemperatureDraggerComponent } from "./temperature/temperature-dragger/temperature-dragger.component";
import { KittenComponent } from "./kitten/kitten.component";
import { SecurityCamerasComponent } from "./security-cameras/security-cameras.component";
import { ElectricityComponent } from "./electricity/electricity.component";
import { ElectricityChartComponent } from "./electricity/electricity-chart/electricity-chart.component";
import { WeatherComponent } from "./weather/weather.component";
import { SolarComponent } from "./solar/solar.component";
import { PlayerComponent } from "./rooms/player/player.component";
import { TrafficComponent } from "./traffic/traffic.component";
import { TrafficChartComponent } from "./traffic/traffic-chart.component";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { WaterCounterComponent } from "./waterCounter/waterCounter.component";
import { TriphaseComponent } from "./triphase/triphase.component";
import { MonophaseComponent } from "./monophase/monophase.component";
import { GaugeChartModule } from "angular-gauge-chart";
import { ChartsModule } from "../charts/charts.module";
import { SmokingComponent } from "./smoking/smoking.component";
import { UiSwitchModule } from "ngx-toggle-switch";
import { SmokeComponent } from "./smoke/smoke.component";
import { An103AComponent } from './AN103/an103-a.component';
import { An303Component } from './AN303/an303.component';
import { AN301Component } from './an301/an301.component';
import { AN302Component } from './an302/an302.component';
import { AN305AComponent } from './an305-a/an305-a.component';
import { AN304CComponent } from './an304-c/an304-c.component';

@NgModule({
  imports: [
    NbToggleModule,
    FormsModule,
    ThemeModule,
    NbUserModule,
    
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    RouterModule,
    NbCheckboxModule,
    NbProgressBarModule,
    NbCardModule,
    GaugeChartModule,
    ChartsModule,
    UiSwitchModule,
    
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    SolarComponent,
    TrafficComponent,
    TrafficChartComponent,
    WaterCounterComponent,
    TriphaseComponent,
    MonophaseComponent,
    SmokingComponent,
    SmokeComponent,
    An103AComponent,
    An303Component,
    AN301Component,
    AN302Component,
    AN305AComponent,
    AN304CComponent ,
  ]
})
export class DashboardModule {}
