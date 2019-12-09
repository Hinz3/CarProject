import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarDataComponent } from '../cardata/cardata.component';

import { CarDataRoutingModule } from './cardata-routing.module';


@NgModule({
  declarations: [CarDataComponent],
  imports: [
    CommonModule,
    CarDataRoutingModule
  ]
})
export class CarDataModule { }
