import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { PeriodTotalComponent } from '../period-total/period-total.component'
import { ExcelDatePipe } from '../period-total/excel-date.pipe'
import { FilterByPropPipe } from '../core/pipes/filterByProp.pipe'
import { SearchableListComponent } from '../searchable-list/searchable-list.component'


@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, PeriodTotalComponent, ExcelDatePipe, FilterByPropPipe, PeriodTotalComponent, PeriodTotalComponent, SearchableListComponent]
})
export class HomeModule {}
