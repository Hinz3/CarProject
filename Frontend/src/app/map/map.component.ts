import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  //map: mapboxgl.Map;
  //style = 'mapbox://styles/mapbox/streets-v11';

  constructor() { }

  ngOnInit() {

    /*  (mapboxgl as typeof mapboxgl).accessToken = "pk.eyJ1IjoibXJ0bnMxIiwiYSI6ImNrM2x2ZzAzMTA3MTUzYm80aTRmMDZtdmcifQ.vVrER8K8sKhPrYBfF3wOUw";
    this.map = new mapboxgl.Map({
       container: 'map',
       style: this.style,
       zoom: 5,
       center: [8.449080, 55.467270]
     });*/

    let map = L.map("map", {
      center: [55.493138, 8.493165],
      zoom: 10
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {   //'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      id: 'mapbox.streets',
      accessToken: "pk.eyJ1IjoibXJ0bnMxIiwiYSI6ImNrM2x2ZzAzMTA3MTUzYm80aTRmMDZtdmcifQ.vVrER8K8sKhPrYBfF3wOUw",
    }).addTo(map);


    var marker = L.marker([55.493138, 8.493165])
      .bindPopup("DATETIME and maybe COORDINATES")
      .addTo(map);
    var marker = L.marker([55.473138, 8.493165])
      .bindPopup("DATETIME and maybe COORDINATES")
      .addTo(map);
    var marker = L.marker([55.483138, 8.493165])
      .bindPopup("DATETIME and maybe COORDINATES")
      .addTo(map);



  }
}
