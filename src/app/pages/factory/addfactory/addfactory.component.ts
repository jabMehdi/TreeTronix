import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import {environment} from '../../../../environments/environment';

  import {MapboxLanguage} from '@mapbox/mapbox-gl-language';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

const Swal = require('sweetalert2');

@Component({
  selector: 'ngx-addfactory',
  templateUrl: './addfactory.component.html',
  styleUrls: ['./addfactory.component.scss'],
})
export class AddfactoryComponent implements OnInit {
  map: mapboxgl.Map;
  public el = new mapboxgl.Marker();
  private Latiude: number;
  private Longitude: number;
  constructor(private http: HttpClient ,
               private router: Router
              , private formBuilder: FormBuilder) { }
  factoryUrl = '/api/factories/factory/add';

    addForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
  });
  submitted = false;
  onSubmit() {
    this.submitted = true ;


      const options = {
        params: new HttpParams().append('token', localStorage.getItem('token')),
      };
      this.http.put(this.factoryUrl,
        {
          name: this.addForm.get('name').value,
          description: this.addForm.get('description').value,
          lng : this.Longitude,
          lat : this.Latiude,
        }, options).subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        if (resJSON.status === 'err') {
          Swal.fire(
            'error!',
            'Please check your data',
            'error',
          );
        } else { Swal.fire(
          'Success!',
          'Factory has been added.',
          'success',
        );
          this.addForm.reset();
          this.Latiude = null ;
          this.Longitude = null ;
          this.router.navigate(['/pages/place']);
        }
      }, error => {
      });
  }

  ngOnInit() {
    (mapboxgl as typeof mapboxgl).accessToken
      = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 9,
      center: [10.196506147691451 , 36.792635314317465],
    });
    // Add map controls
    this.map.on('click', hello => {
      this.Longitude = hello.lngLat.lng;
      this.Latiude = hello.lngLat.lat;
      this.el.setLngLat([hello.lngLat.lng, hello.lngLat.lat])
        .addTo(this.map);
    });
  }

}
