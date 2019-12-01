import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  constructor() { }

  ngOnInit() {
    (mapboxgl as typeof mapboxgl).accessToken = "pk.eyJ1IjoibXJ0bnMxIiwiYSI6ImNrM2x2ZzAzMTA3MTUzYm80aTRmMDZtdmcifQ.vVrER8K8sKhPrYBfF3wOUw";
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 5,
        center: [8.449080,55.467270]
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    var coords = new mapboxgl.LngLat(8.485637,55.487389);

    var marker = new mapboxgl.Marker()
      .setLngLat(coords)
      .addTo(this.map)
      .setPopup(new mapboxgl.Popup().setText("bruh"));
  }


}
