import { Component, OnInit } from '@angular/core';
import { CarData } from 'src/assets/CarData';
import { TripData } from 'src/assets/TripData';
import { DataService } from '../data.service';
import * as L from 'leaflet';

import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  idle = '-'
  avgSpeed = 0;
  avgRpm = 0;
  avgThrottle = 0;
  maxSpeed = 0;
  maxSpeedTime = '-';
  maxRpm = 0;
  maxRpmTime = '-';
  maxThrottle = 0;
  maxThrottleTime = '-';
  ////////
  selectedTrip: string;
  trips: Array<TripData> = [];
  carData: CarData[];
  map: L.Map;
  dt: Date;
  deg: any;
  api: string;
  marker: L.Marker;
  markers: Array<L.Marker> = [];

  date: NgbDate;
  // fromDate: NgbDate;
  // toDate: NgbDate;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, calendar: NgbCalendar) {
    //this.date = calendar.getToday();
    //this.toDate = calendar.getNext(calendar.getToday(), 'd', 2);

    this.form = this.formBuilder.group({
      trips: []
    });
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


  FillStats(tripId: string) {
    this.idle = '-';
    this.avgSpeed = 0;
    this.avgRpm = 0;
    this.avgThrottle = 0;
    this.maxSpeed = 0;
    this.maxSpeedTime = '-';
    this.maxRpm = 0;
    this.maxRpmTime = '-';
    this.maxThrottle = 0;
    this.maxThrottleTime = '-';

    var avgSpeed = 0;
    var avgRpm = 0;
    var avgThrottle = 0;
    var avgCount = 0;

    var idleTime = 0;
    var previousDt = new Date();
    var previousIdle = false;
    //Loop through API data
    if (this.trips.length > 0 && this.trips[0].Trip != null) {

      this.trips[(Number(tripId) - 1)].Trip.forEach(element => {

        if (element.gps != null) {
          var dt = new Date(Number(element.timestamp.toString()) * 1000);

          if (Number(element.speed) == 0) {
            if (previousIdle) {
              idleTime += dt.getTime() - previousDt.getTime();
            }
            previousIdle = true;
          } else {
            avgSpeed += Number(element.speed);
            avgRpm += Number(element.rpm);
            avgThrottle += Number(element.throttle_position);
            avgCount += 1;
            previousIdle = false;
          }

          if (Number(element.speed) > this.maxSpeed) {
            this.maxSpeed = Number(element.speed)
            this.maxSpeedTime = 'Date: ' + dt.toDateString() + ' Time: ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
          }
          if (Number(element.rpm) > this.maxRpm) {
            this.maxRpm = Number(element.rpm)
            this.maxRpmTime = 'Date: ' + dt.toDateString() + ' Time: ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
          }
          if (Number(element.throttle_position) > this.maxThrottle) {
            this.maxThrottle = Number(Number(element.throttle_position).toFixed(2))
            this.maxThrottleTime = 'Date: ' + dt.toDateString() + ' Time: ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
          }

          previousDt = dt;
        }

      });
    }
    this.avgSpeed = Number((avgSpeed / avgCount).toFixed(1));
    this.avgRpm = Number((avgRpm / avgCount).toFixed(0));
    this.avgThrottle = Number((avgThrottle / avgCount).toFixed(2));
    this.idle = new Date(idleTime).getMinutes().toString() + 'min ' + new Date(idleTime).getSeconds().toString() + 's';
  }

  async FillMap(api: string) {
    //Delete old markers if there is any
    if (this.markers != null) {
      this.markers.forEach(element => {
        element.remove();
      });
    }
    if (this.trips != null) {
      this.trips = [];
    }


    //Get data from API
    this.carData = await this.dataService.getCarData(api);

    var tripCount = 0
    let trip = <TripData>{ TripId: '0', Trip: Array<CarData>() };

    //Loop through API data
    this.carData.forEach(element => {

      //If first item of the trip
      if (element.gps == null) {
        tripCount += 1;
        if (trip.Trip.length > 0) {
          this.trips.push(trip)
          trip = <TripData>{ TripId: '0', Trip: Array<CarData>() };
        }
        trip.TripId = tripCount.toString();

      } else {
        trip.Trip.push(element)
      }
    });

    if (trip != null) {
      this.trips.push(trip) // to add last trip
    }

    if (this.trips.length > 0 && this.trips[0].Trip.length > 0) {

      this.trips[0].Trip.forEach(element => {

        if (element.gps != null) { // null gps means start of the trip
          if (element.gps.toString() != 'GPS Not available') {
            //Convert from UNIX datetime
            this.dt = new Date(Number(element.timestamp.toString()) * 1000);

            //Get latitude and longitude from API data
            var coords = element.gps.toString().split(",");
            var lat = this.ConvertToDEG(coords[0])
            var lng = this.ConvertToDEG(coords[1].substr(1))

            //Add new marker
            this.marker = L.marker([lat, lng])
              .bindPopup('Date: ' + this.dt.toDateString() +
                '<br>Time: ' + this.dt.getHours() + ':' + this.dt.getMinutes() +
                '<br>Speed: ' + element.speed +
                'Km/h<br>RPMs: ' + element.rpm + '/min' +
                '<br>Throttle position: ' + Number(element.throttle_position).toFixed(2) + '%')
              .addTo(this.map);

            //Add marker to the list so it will we can delete them later
            this.markers.push(this.marker);
          }
        }
      });
    }

    this.FillStats("1")
  }


  AddMarkers(tripId: string) {
    //Delete old markers if there is any
    if (this.markers != null) {
      this.markers.forEach(element => {
        element.remove();
      });
    }

    if (this.trips.length > 0 && this.trips[0].Trip != null) {

      this.trips[(Number(tripId) - 1)].Trip.forEach(element => {

        if (element.gps != null) { // null gps means start of the trip
          if (element.gps.toString() != 'GPS Not available') {
            //Convert from UNIX datetime
            this.dt = new Date(Number(element.timestamp.toString()) * 1000);

            //Get latitude and longitude from API data
            var coords = element.gps.toString().split(",");
            var lat = this.ConvertToDEG(coords[0])
            var lng = this.ConvertToDEG(coords[1].substr(1))

            //Add new marker
            this.marker = L.marker([lat, lng])
              .bindPopup('Date: ' + this.dt.toDateString() +
                '<br>Time: ' + this.dt.getHours() + ':' + this.dt.getMinutes() +
                '<br>Speed: ' + element.speed +
                'Km/h<br>RPMs: ' + element.rpm + '/min' +
                '<br>Throttle position: ' + Number(element.throttle_position).toFixed(2) + '%')
              .addTo(this.map);

            //Add marker to the list so it will we can delete them later
            this.markers.push(this.marker);
          }
        }
      });
    }

  }

  ngOnInit() {
    this.api = 'http://api.cartracker.hinz3.dk/api/car/BL86205';

    this.map = L.map("map", {
      center: [55.493138, 8.493165],
      zoom: 12
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {   //'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      id: 'mapbox.streets',
      accessToken: "pk.eyJ1IjoibXJ0bnMxIiwiYSI6ImNrM2x2ZzAzMTA3MTUzYm80aTRmMDZtdmcifQ.vVrER8K8sKhPrYBfF3wOUw",
    }).addTo(this.map);


    //this.FillMap(this.api);
  }

  selectTripHandler(event: any) {
    //update the ui
    this.AddMarkers(event.target.value)
    this.FillStats(event.target.value)
  }

  onDateSelection(date: NgbDate) {

    this.api = 'http://api.cartracker.hinz3.dk/api/car/BL86205?year=' + date.year.toString() + '&month=' + date.month.toString() + '&day=' + date.day.toString();//FOR TESTING
    this.FillMap(this.api);//FOR TESTING
    this.date = date;

  }
}
