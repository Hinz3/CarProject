import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { StatisticsComponent } from './statistics.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'statistics', component: StatisticsComponent, data: { title: extract('Statistics') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class StatisticsRoutingModule { }