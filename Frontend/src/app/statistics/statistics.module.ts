import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from '../statistics/statistics.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatisticsRoutingModule } from './statistics-routing.module';


@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    NgbModule
  ]
})
export class StatisticsModule { }
