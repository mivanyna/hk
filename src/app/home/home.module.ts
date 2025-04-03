import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { PeriodTotalComponent } from '../period-total/period-total.component'
import { ExcelDatePipe } from '../period-total/excel-date.pipe'
import { FilterByPropPipe } from '../core/pipes/filterByProp.pipe'
import { SearchableListComponent } from '../searchable-list/searchable-list.component'
import { LcTotalComponent } from '../lc-total/lc-total.component'
import { PlanProgressComponent } from '../plan-progress/plan-progress.component'
import { WeekComponent } from '../week/week.component'


@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, PeriodTotalComponent, ExcelDatePipe, FilterByPropPipe, PeriodTotalComponent, PeriodTotalComponent, SearchableListComponent, LcTotalComponent, PlanProgressComponent, WeekComponent]
})
export class HomeModule {}
