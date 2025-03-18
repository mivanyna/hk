import { Component, Input } from '@angular/core'
import { DatePipe, NgClass } from '@angular/common'
import { ExcelDatePipe } from '../period-total/excel-date.pipe'
import { FilterByPropPipe } from '../core/pipes/filterByProp.pipe'
import { FormsModule } from '@angular/forms'
import { ISoldierData } from '../shared/ISoldierData'
import { ISoldierDataHelper } from '../shared/utils/ISoldierDataHelper'

@Component({
  selector: 'searchable-list',
  standalone: true,
  template: `
    <div class="search-container">
      <input type="text" [(ngModel)]="term" name="filterVal"> <button type="button" [disabled]="!term" (click)="term=''">x</button>
      {{selectedTotal.total}}/{{selectedTotal.officers}} <button type="button" [disabled]="!selected.length" (click)="selected=[];calcTotal()">x</button>
    </div>

    <div class="list">
      @if ((excelData | filterByProp: 'dest':term); as data) {
        @for (record of data; track record; let index = $index) {
          <div
            class="row"
            (mousedown)="startSelection($event, record)"
            (mousemove)="handleMouseDrag($event, record)"
            (mouseup)="stopSelection()"
            (click)="toggle(record);calcTotal()"
            [ngClass]="{'selected': selected.includes(record)}">
            <div class="cell day">{{record.day}}</div> <div class="cell week">{{record.week}} </div> <div class="cell month">{{record.month}}</div>
            <div class="cell date" [ngClass]="{'invisible': record.date === data[index-1]?.date}">{{record.date | excelDate | date:dateFormat}} </div>
            <div class="cell dest" [ngClass]="{'invisible': record.dest === data[index-1]?.dest && record.date === data[index-1]?.date, 'divider': record.date != data[index-1]?.date}">{{record.dest}}</div>
          </div>
        }
      }
    </div>

  `,
  imports: [
    NgClass,
    DatePipe,
    ExcelDatePipe,
    FilterByPropPipe,
    FormsModule
  ],
  styleUrl: 'searchable-list.component.scss'
})
export class SearchableListComponent {
  @Input() excelData: ISoldierData[] = []

  protected selected: ISoldierData[] = []

  dateFormat = 'dd.MM.YYYY';
  term = ''

  selectedTotal = {
    total: 0, officers: 0
  }

  isSelecting = false;
  selectedRows: ISoldierData[] = [];

  ngOnInit() {
    this.selected = []
  }


  toggle(val: ISoldierData) {
    if (this.isSelecting) {
      return
    }
    if (this.selected.includes(val)) {
      this.selected.splice(this.selected.indexOf(val), 1)
    } else {
      this.selected.push(val)
    }
  }

  startSelection(event: MouseEvent, row: ISoldierData) {
    this.isSelecting = true
    // this.toggle(row)
  }

  handleMouseDrag(event: MouseEvent, row: ISoldierData) {
    if (this.isSelecting) {
      !this.selectedRows.includes(row) && this.selectedRows.push(row)
    }
  }

  stopSelection() {
    this.isSelecting = false
    this.selectedRows.forEach((row: ISoldierData) => {this.toggle(row)})
    this.selectedRows = []
    this.calcTotal()
  }


  calcTotal() {
    this.selectedTotal = {total: 0, officers: 0}
    this.selected.forEach((item) => {
      this.selectedTotal.total += 1
      this.selectedTotal.officers += ISoldierDataHelper.isOfficer(item)
    })
  }

  ngOnChanges(): void {
  }
}
