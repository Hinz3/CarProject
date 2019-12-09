import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { CarDataComponent } from './cardata.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'car', component: CarDataComponent, data: { title: extract('cardata') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CarDataRoutingModule { }