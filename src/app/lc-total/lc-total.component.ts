import { Component, Input } from '@angular/core'
import { NgClass } from '@angular/common'
import { ITotal } from '../period-total/ITotal'
import * as XLSX from 'xlsx'
const destMap: {[s: string]: string} = {}

interface IMilUnitLC {
  unit: string
  name: string
}

@Component({
  selector: 'lc-total',
  standalone: true,
  template: `
    <div class="select-file">
      <label for="input2"> Select file... </label>
      <input type="file" id="input2" name="input2" hidden="hidden" (change)="onFileChange($event)" accept=".xlsx, .xls">
    </div>

    <div>{{ title }}</div>

    @for (dest of data; track dest) {
      @if (dest.count - dest.loan) {
        <div class="dest" (click)="toggle(dest)" [ngClass]="{'selected': selected.includes(dest)}">
          <div>{{ dest.dest }}</div>
          <div>{{ destMap[dest.dest] || dest.dest }}</div>
          <div>{{ dest.count }}/{{ dest.officers }}</div>
        </div>
      }
    }

    <div class="dest">

    </div>

 <!--   @for (dest of data; track dest) {
      @if (dest.loan) {
        <div class="dest loan" [ngClass]="{'selected': selected.includes(dest)}">
          <div>{{ dest.dest }}</div>
          <div>{{ dest.loan }}/{{ dest.loanOfficers }}</div>
        </div>
      }
    }-->

<!--    <div class="dest total">
      <div>{{ total.total }}/{{ total.officers }}</div>
      @if (selected.length) {
        <div (click)="selected = []">x</div>
      }
    </div>-->
  `,
  imports: [
    NgClass
  ],
  styleUrl: 'lc-total.component.css'
})
export class LcTotalComponent {
  @Input() title = ''
  @Input() data: ITotal[] = []

  protected selected: ITotal[] = []

  destMap = destMap

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

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary', cellStyles: false });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const range = XLSX.utils.decode_range(worksheet['!ref'] || '');

      const map: IMilUnitLC[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, range, skipHidden: true,
        header: ['unit', 'name']
      });

      map.forEach(item => {
        this.destMap[item.unit] = item.name
      })
    };
    reader.readAsBinaryString(file);
  }

}
