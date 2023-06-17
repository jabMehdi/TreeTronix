import {Component, Input} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {DashService} from '../dash.service';
@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card (click)="on = !on "  [ngClass]="{'off': !on}">
      <div class="icon-container">
        <div class="icon status-{{ type }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title h5">{{ title }}</div>
        <div class="status paragraph-2"> state : {{ on ? 'ON' : 'OFF' }}</div>
        <div class="status paragraph-3"> ID : {{code}} </div>
        <div class="status paragraph-4"> Battery Level : {{batteryLevel}} %</div>
        <div class="status paragraph-5"> factory : {{factory}}</div>
        <div class="status paragraph-6"> place : {{place}}</div>

      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {
  constructor() {
  }

  public data;
  public val;
  @Input() title: string;
  @Input() type: string;
  @Input() on: boolean;
  @Input() code: string;
  @Input() batteryLevel: string;
  @Input() place: string;
  @Input() factory: string;


}
