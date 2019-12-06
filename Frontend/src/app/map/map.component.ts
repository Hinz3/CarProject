import { Component, OnInit } from '@angular/core';
import { CarData } from 'src/assets/CarData';
import { DataService } from '../data.service';
import * as L from 'leaflet';

import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  //styleUrls: ['./map.component.scss']
  styles: [`
  .custom-day {
    text-align: center;
    padding: 0.185rem 0.25rem;
    display: inline-block;
    height: 2rem;
    width: 2rem;
  }
  .custom-day.focused {
    background-color: #e6e6e6;
  }
  .custom-day.range, .custom-day:hover {
    background-color: rgb(2, 117, 216);
    color: white;
  }
  .custom-day.faded {
    background-color: rgba(2, 117, 216, 0.5);
  }
`]
})

//DATE PICKER EXAMPLES
//https://ng-bootstrap.github.io/#/components/datepicker/examples
export class MapComponent implements OnInit {
  carData: CarData[];
  map: L.Map;
  dt: Date;
  deg: any;
  api: string;
  marker: L.Marker;
  markers: Array<L.Marker> = [];

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(private dataService: DataService, calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 2);
  }

  //map: mapboxgl.Map;
  //style = 'mapbox://styles/mapbox/streets-v11';
  ConvertToDEG(dms: string) {
    var dms_Array = dms.split(" ");
    var degrees = dms_Array[0];
    dms_Array = dms_Array[1].split("'");
    var minutes = dms_Array[0];
    var direction = dms_Array[1];

    this.deg = (Number(minutes) / 60 + Number(degrees))

    if (direction == "S" || direction == "W") {
      this.deg = this.deg * -1;
    } // Don't do anything for N or E
    return this.deg;
  }

  async FillMap(api: string) {

    //Delete old markers if there is any
    if (this.markers != null) {
      this.markers.forEach(element => {
        element.remove();
      });
    }


    //Get data from API
    this.carData = await this.dataService.getCarData(api);

    //Loop through API data
    this.carData.forEach(element => {

      if (element.gps.toString() != 'GPS Not available' && element.gps.toString() != '5529.58399 00829.45657') {

        //Convert from UNIX datetime
        this.dt = new Date(Number(element.timestamp.toString()) * 1000);

        //Get latitude and longitude from API data
        var coords = element.gps.toString().split(",");
        var lat = this.ConvertToDEG(coords[0])
        var lng = this.ConvertToDEG(coords[1].substr(1))

        //Add new marker
        this.marker = L.marker([lat, lng])
          .bindPopup(this.dt.getHours() + ":" + this.dt.getMinutes() + ", " + this.dt.toDateString())
          .addTo(this.map);

        //Add marker to the list so it will we can delete them later
        this.markers.push(this.marker);
      }
    });

  }

  ngOnInit() {
    this.api = 'http://api.cartracker.hinz3.dk/api/car/BL86205';

    this.map = L.map("map", {
      center: [55.493138, 8.493165],
      zoom: 10
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {   //'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      id: 'mapbox.streets',
      accessToken: "pk.eyJ1IjoibXJ0bnMxIiwiYSI6ImNrM2x2ZzAzMTA3MTUzYm80aTRmMDZtdmcifQ.vVrER8K8sKhPrYBfF3wOUw",
    }).addTo(this.map);

    //this.FillMap(this.api);
  }

  onDateSelection(date: NgbDate) {

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.api = 'http://api.cartracker.hinz3.dk/api/car/BL86205?year=' + date.year.toString() + '&month=' + date.month.toString() + '&day=' + date.day.toString();//FOR TESTING
      this.FillMap(this.api);//FOR TESTING
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
}
