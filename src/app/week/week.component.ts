import { Component, Input } from '@angular/core'
import { ICompletedPlan, IPlanItem } from '../plan-progress/IPlanItem'
import { ITotal } from '../period-total/ITotal'
import { PlanProgressComponent } from '../plan-progress/plan-progress.component'


@Component({
  selector: 'week',
  standalone: true,

  template: `
    <div>{{ title }}</div>

    @for (plan of completedPlan; track plan) {
      <plan-progress [data]="plan" />
    }
  `,
  imports: [
    PlanProgressComponent
  ],
   styles: [`
     plan-progress {
       margin-bottom: 5px;
     }
   `]
})
export class WeekComponent {
  @Input() title = ''
  @Input() data: ITotal[] = []
  @Input() plan?: IPlanItem[] = []

  map: {[s: string]: ICompletedPlan} = {}

  completedPlan: ICompletedPlan[] = []

  total = {
    total: 0, officers: 0
  }
  totalPlan = {
    total: 0, officers: 0
  }


  ngOnChanges(): void {
    this.total.total = 0
    this.total.officers = 0
    this.data?.forEach(item => {
      this.total.total += item.count
      this.total.officers += item.officers
    })

    this.map = { }
    const map = this.map

    this.totalPlan.total = 0
    this.totalPlan.officers = 0

    this.plan?.forEach(item => {
      map[item.milUnit] = { ...item }
      this.totalPlan.total += item.planTotal
      this.totalPlan.officers += item.planOfficers || 0
    })

    this.data?.forEach(item => {
      map[item.dest] = map[item.dest] || { milUnit: item.dest}
      map[item.dest].serv = item.count
      map[item.dest].servOfficers = item.officers
    })

    this.total.total = 0
    this.total.officers = 0

    const planUnits = this.plan?.map(item => item.milUnit) || []

    const total: ICompletedPlan = {milUnit: 'Виконано', planTotal: this.totalPlan.total, planOfficers: this.totalPlan.officers, serv: 0, servOfficers: 0}

    this.completedPlan = [total].concat(planUnits.map(u => map[u]))

    this.data?.forEach(item => {
      this.total.total += item.count
      this.total.officers += item.officers
      if (!planUnits.includes(item.dest)) {
        this.completedPlan.push(map[item.dest])
      }
    })
    total.serv = this.total.total
    total.servOfficers = this.total.officers
  }
}
