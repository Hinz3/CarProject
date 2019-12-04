import { Component, OnInit } from '@angular/core';
import { CarData } from 'src/assets/CarData';
import { DataService } from '../data.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit {
  constructor(private dataService: DataService) { }

  carData: CarData[];
  map: L.Map;
  dt: any;
  deg: any;

  //map: mapboxgl.Map;
  //style = 'mapbox://styles/mapbox/streets-v11';
  ConvertToDEG(dms:string) {   
    var dms_Array = dms.split(" "); 
    var degrees = dms_Array[0];
    dms_Array = dms_Array[1].split("'");
    var minutes = dms_Array[0];
    var direction = dms_Array[1];

    this.deg = (Number(minutes)/60 + Number(degrees))

    if (direction == "S" || direction == "W") {
        this.deg = this.deg * -1;
    } // Don't do anything for N or E
    return this.deg;
}

  async FillMap() {
    this.carData = await this.dataService.getCarData();
    this.carData.forEach(element => {


      if (element.gps.toString() != 'GPS Not available' && element.gps.toString() != '5529.58399 00829.45657') {

      this.dt = new Date(Number(element.timestamp.toString()));
        var coords = element.gps.toString().split(",");

        var lat = this.ConvertToDEG(coords[0])
        var lng = this.ConvertToDEG(coords[1].substr(1))

        L.marker([lat, lng])
          .bindPopup(this.dt.toString())
          .addTo(this.map);
      }
    });


  }
  ngOnInit() {

    this.map = L.map("map", {
      center: [55.493138, 8.493165],
      zoom: 10
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {   //'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      id: 'mapbox.streets',
      accessToken: "pk.eyJ1IjoibXJ0bnMxIiwiYSI6ImNrM2x2ZzAzMTA3MTUzYm80aTRmMDZtdmcifQ.vVrER8K8sKhPrYBfF3wOUw",
    }).addTo(this.map);

    this.FillMap();
  }
}
