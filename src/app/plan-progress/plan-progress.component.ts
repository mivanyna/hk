import { Component, Input } from '@angular/core'
import { NgClass } from '@angular/common'
import { ICompletedPlan, IPlanItem } from './IPlanItem'
import { ITotal } from '../period-total/ITotal'

@Component({
  selector: 'plan-progress',
  standalone: true,
  template: `
    @if (data?.planOfficers || data?.servOfficers) {
      <div class="plan-officers">
        <div class="unit-name">{{ data?.milUnit }}</div>
        <div class="details">
          <div class="half">План</div>
          <div class="half">Прийнято</div>
        </div>
        <div class="details">
          <div class="half">
            <div class="details">
              <div class="half">Всього</div>
              <div class="half">з них оф.</div>
            </div>
            <div class="details">
              <div class="half planned">{{ data?.planTotal }}</div>
              <div class="half planned">{{ data?.planOfficers }}</div>
            </div>
          </div>
          <div class="half">
            <div class="details">
              <div class="half">Всього</div>
              <div class="half">з них оф.</div>
            </div>
            <div class="details">
              <div class="half"> {{ data?.serv }}</div>
              <div class="half"> {{ data?.servOfficers }}</div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="plan">
        <div class="unit-name">{{ data?.milUnit }}</div>
        <div class="details">
          <div class="half title">План</div>
          <div class="half title">Прийнято</div>
        </div>
        <div class="details">
          <div class="half planned"> {{ data?.planTotal }}</div>
          <div class="half"> {{ data?.serv }}</div>
        </div>
      </div>
    }
  `,
  imports: [
    NgClass
  ],
  styles: `
    :host {
      vertical-align: top;
    }
    .plan, .plan-officers {
      display: inline-block;
      text-align: center;
      border: 1px solid grey;
      margin-bottom: 5px;
    }
    .planned {
      background: lightgoldenrodyellow;
    }
    .half {
      width: 50%;
      min-width: 70px;
      border-top: 1px solid grey;
      min-height: 18px;
      align-content: center;
    }
    .title {
      min-height: 38px;
    }
    .half:first-child {
      border-right: 1px solid grey;
    }
    .unit-name {
      height: 35px;
      align-content: center;
      background: lightblue;
    }
    .details {
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: center;
      align-items: stretch;
    }
  `
})
export class PlanProgressComponent {
  @Input() title = ''
  @Input() data?: ICompletedPlan
}
