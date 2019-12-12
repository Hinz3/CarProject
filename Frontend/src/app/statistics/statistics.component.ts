import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CarData } from 'src/assets/CarData';
import { DataService } from '../data.service';
import { timingSafeEqual } from 'crypto';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  //styleUrls: ['./statistics.component.scss']
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
export class StatisticsComponent implements OnInit {
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  carData: CarData[];
  avgSpeed = 0;
  avgRpm = 0;
  avgThrottle = 0;
  maxSpeed = 0;
  maxSpeedTime ='-';
  maxRpm = 0;
  maxRpmTime ='-';
  maxThrottle = 0;
  maxThrottleTime ='-';

  api: string;


  constructor(private dataService: DataService, calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
    this.api = 'http://api.cartracker.hinz3.dk/api/car/BL86205';
  }

  async FillData() {

    this.avgSpeed = 0;
    this.avgRpm = 0;
    this.avgThrottle = 0;
    this.maxSpeed = 0;
    this.maxRpm = 0;
    this.maxThrottle = 0;

    //Get data from API
    this.carData = await this.dataService.getCarData(this.api);

    var avgSpeed = 0;
    var avgRpm = 0;
    var avgThrottle = 0;
    var avgCount = 0;
    //Loop through API data
    this.carData.forEach(element => {
      avgSpeed += Number(element.speed);
      avgRpm += Number(element.rpm);
      avgThrottle += Number(element.throttle_position);
      avgCount += 1;
      if (Number(element.speed) > this.maxSpeed) {
        this.maxSpeed = Number(element.speed)
        var dt=new Date(Number(element.timestamp.toString()) * 1000);
        this.maxSpeedTime ='Date: ' + dt.toDateString()+ ' Time: '+ dt.getHours()+':' + dt.getMinutes() + ':'+dt.getSeconds();
      }
      if (Number(element.rpm) > this.maxRpm) {
        this.maxRpm = Number(element.rpm)
        var dt=new Date(Number(element.timestamp.toString()) * 1000);
        this.maxRpmTime ='Date: ' + dt.toDateString()+ ' Time: '+ dt.getHours()+':' + dt.getMinutes() + ':'+dt.getSeconds();
      }
      if (Number(element.throttle_position) > this.maxThrottle) {
        this.maxThrottle = Number(Number(element.throttle_position).toFixed(2))
        var dt=new Date(Number(element.timestamp.toString()) * 1000);
        this.maxThrottleTime ='Date: ' + dt.toDateString()+ ' Time: '+ dt.getHours()+':' + dt.getMinutes() + ':'+dt.getSeconds();
      }

    });

    this.avgSpeed = Number((avgSpeed / avgCount).toFixed(1));
    this.avgRpm = Number((avgRpm / avgCount).toFixed(0));
    this.avgThrottle = Number((avgThrottle / avgCount).toFixed(2));

  }

  ngOnInit() {
  }

  onDateSelection(date: NgbDate) {

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.api = 'http://api.cartracker.hinz3.dk/api/car/BL86205?year=' + date.year.toString() + '&month=' + date.month.toString() + '&day=' + date.day.toString();
      this.FillData();
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
