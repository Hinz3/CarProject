import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarData } from 'src/assets/CarData';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://api.cartracker.hinz3.dk/api/car/BL86205";

  constructor(private httpClient: HttpClient) { }

  async getCarData(): Promise<CarData[]> {
    return this.httpClient
      .get(this.REST_API_SERVER)
      .pipe(map((body: CarData[]) => {
        return <CarData[]>body;
      })).toPromise();
  }
}