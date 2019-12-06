import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapRoutingModule } from './map-routing.module';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    NgbModule
  ],
  exports: [MapComponent],
  bootstrap: [MapComponent]
})
export class MapModule { }
