
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from '../../../environments/environment';
import {Console} from 'console';

import {HttpClient, HttpParams} from '@angular/common/http';
import {Factory} from '../model/factory';



@Component({
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss'] ,
})
export class MapboxComponent implements OnInit {
  map: mapboxgl.Map;
  option = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
  MapboxLanguage = require('@mapbox/mapbox-gl-language');
  factoryUrl = '/api/factories/factory/all';
  constructor(private http: HttpClient) { }
  private data:  Array<any> ;
  public  test ;
  ngOnInit() {
        this.http.post(this.factoryUrl,
        {
        }, this.option).subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.data = resJSON ;
        this.data.forEach(item => {

          // create the popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            '<h2 class="text-info">' + item.name + '</h2>' + '<h5 class="text-basic"> ' +
            'Devices : ' + item.sensorsId.length + '</h5>',
          );
          new mapboxgl.Marker().setLngLat([item.lng, item.lat]).setPopup(popup).addTo(this.map);
        });

      });
this.showMap();


  }

  showMap() {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 9,
      center: [10.196506147691451 , 36.792635314317465],
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    const language = new this.MapboxLanguage({
      defaultLanguage: 'en',
    });
    this.map.addControl(language);






  }
}
