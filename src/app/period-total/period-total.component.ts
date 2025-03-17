import { Component, Input } from '@angular/core'
import { ITotal } from './ITotal'
import { toggle } from 'cli-cursor'
import { NgClass } from '@angular/common'

@Component({
  selector: 'period-total',
  standalone: true,

  template: `
    <div>{{ title }}</div>

    @for (dest of data; track dest) {
      @if (dest.count - dest.loan) {
        <div class="dest" (click)="toggle(dest)" [ngClass]="{'selected': selected.includes(dest)}">
          <div>{{ dest.dest }}</div>
          <div>{{ dest.count - dest.loan }}/{{ dest.officers - dest.loanOfficers }}</div>
        </div>
      }
    }

    <div class="dest">

    </div>

    @for (dest of data; track dest) {
      @if (dest.loan) {
        <div class="dest loan" [ngClass]="{'selected': selected.includes(dest)}">
          <div>{{ dest.dest }}</div>
          <div>{{ dest.loan }}/{{ dest.loanOfficers }}</div>
        </div>
      }
    }

    <div class="dest total">
      <div>{{ total.total }}/{{ total.officers }}</div>
      @if (selected.length) {
        <div (click)="selected = []"> x</div>
      }
    </div>
  `,
  imports: [
    NgClass
  ],
  styleUrl: 'period-total.component.css'
})
export class PeriodTotalComponent {
  @Input() title = ''
  @Input() data: ITotal[] = []

  protected selected: ITotal[] = []

  total = {
    total: 0, officers: 0
  }

  ngOnInit() {
    this.selected = []
  }

  toggle(val: ITotal) {
    if (this.selected.includes(val)) {
      this.selected.splice(this.selected.indexOf(val), 1)
    } else {
      this.selected.push(val)
    }
  }

  ngOnChanges(): void {
    this.total.total = 0
    this.total.officers = 0
    this.data?.forEach(item => {
      this.total.total += item.count
      this.total.officers += item.officers
    })
  }
}
