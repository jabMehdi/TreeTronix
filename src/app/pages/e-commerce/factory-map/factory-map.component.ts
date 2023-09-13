import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment'; // adjust the path
import { AuthService } from '../../auth/service/auth.service'; // import your auth service
   
import { Factory } from '../../model/factory';

@Component({
  selector: 'app-factory-map',
  templateUrl: './factory-map.component.html',
  styleUrls: ['./factory-map.component.scss'],
})
export class FactoryMapComponent implements OnInit {
  map: mapboxgl.Map;
option = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };
   MapboxLanguage = require('@mapbox/mapbox-gl-language');
   factoryUrl = '/api/factories/factory/all';
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.post('http://localhost:4200/api/factories/factory/all', {}, this.option).subscribe((data: Factory[]) => {
      this.showMap(data);
    });
  }

  showMap(factories: Factory[]) {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 9,
      center: [10.196506147691451, 36.792635314317465], // Adjust this center
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    factories.forEach(factory => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        '<h2 class="text-info">' +
          factory.name +
          '</h2>' +
          '<h5 class="text-basic"> ' +
          'Devices: ' +
          factory.sensorsId.length +
          '</h5>'
      );

      new mapboxgl.Marker()
        .setLngLat([factory.lng, factory.lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }
}

