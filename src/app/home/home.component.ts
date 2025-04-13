import { Component } from '@angular/core';
import { ITotal } from '../period-total/ITotal';
import * as XLSX from 'xlsx';
import { ISoldierData } from '../shared/ISoldierData';
import { ISoldierDataHelper } from '../shared/utils/ISoldierDataHelper'
import { IPlanItem } from '../plan-progress/IPlanItem'

enum Views {
  file,
  totals,
  totalsByWeek,
  searchList,
  learnCenter
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'excel';
  planWeeks: IPlanItem[][] = []
  weekTotals: ITotal[][] = []
  monthPlan: IPlanItem[] = []

  views = [
    { id: Views.file, name: 'Файл' },
    { id: Views.totals, name: 'Сумарно' },
    { id: Views.totalsByWeek, name: 'Сумарно тижні' },
    { id: Views.searchList, name: 'Список місяць' },
    { id: Views.learnCenter, name: 'НЦ' },
  ]

  activeView = Views.totals;

  excelData: ISoldierData[] = []
  lastMonthTotal: ITotal[] = []
  lastWeekTotal: ITotal[] = []
  opTotal: ITotal[] = []

  onPlanFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    this.planWeeks = []
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary', cellStyles: true });
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];

        const range = XLSX.utils.decode_range(worksheet['!ref'] || '');

        const planDetails: IPlanItem[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, range, skipHidden: true,
          header: ['milUnit', 'planTotal', 'planOfficers']
        });
        this.planWeeks.push(planDetails)
      })

      this.planWeeks.forEach(plan => {
        plan.forEach((item: IPlanItem) => {
          const mp = this.monthPlan.find(p => p.milUnit === item.milUnit)
          if (mp) {
            mp.planTotal += item.planTotal
            mp.planOfficers = (mp.planOfficers || 0)  + (item.planOfficers || 0)
          } else {
            this.monthPlan.push({...item})
          }
        })

      })
      this.activeView = Views.totals
    };
    reader.readAsBinaryString(file);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary', cellStyles: true });
      const firstSheetName = workbook.SheetNames[5];
      const worksheet = workbook.Sheets[firstSheetName];

      const range = XLSX.utils.decode_range(worksheet['!ref'] || '');
      range.s.c = 0;
      range.e.c = 30;
      range.s.r = 3;
      range.s.r = range.e.r - 300

      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true, range, skipHidden: true,
        header: ['day', 'week', 'month', 'date', 'dest', 'rank', 'name', ...[7, 8, 9, 10].map(i => `col${i}`), 'birth', 'age', 'health']
      });

      const reverse = this.excelData.reverse()
      const index = reverse.findIndex(r => r.month === 1)
      const lastMonth = reverse.splice(0, index + 1).reverse()
      this.excelData = lastMonth
      this.normalizeData(this.excelData)

      const lastRowNo = range.e.r
      const c = 6
      const monthRecords = lastMonth.length
      for (let r = 0; r <= monthRecords - 1; r++) {
        const cellAddress = { c, r: lastRowNo - r };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = worksheet[cellRef]

        if (cell) {
          const cellColor = this.getCellColor(cell);
          if (cellColor) {
            lastMonth[monthRecords - r - 1].loan = 1
          }
        }
      }

      this.excelData = this.excelData.filter(r => r.month)

      this.lastMonthTotal = this.getGroupedData(this.excelData)

      const lastWeek = [...lastMonth].reverse()
      const lastWeekIndex = lastWeek.findIndex(i => i.week === 1)
      const lastWeekData = lastWeek.splice(0, lastWeekIndex + 1).reverse()

      this.weekTotals = []
      let currentWeekData: ISoldierData[] = []
      lastMonth.forEach((item, idx) => {
        if (item.week === 1 && idx) {
          this.weekTotals.push(this.getGroupedData(currentWeekData))
          currentWeekData = []
        }
        currentWeekData.push(item)
      })
      this.weekTotals.push(this.getGroupedData(currentWeekData))

      this.lastWeekTotal = this.getGroupedData(lastWeekData)

      const opData = this.excelData.filter(i => i.health || i.age > 50)

      this.opTotal = this.getGroupedData(opData)
    };
    reader.readAsBinaryString(file);
  }

  private getCellColor(cell: any) {
    if (cell.s && cell.s) {
      return cell.s.fgColor ? cell.s.fgColor.rgb : null;
    }
    return null;
  }

  private normalizeData(data: ISoldierData[]) {
    data.forEach((item, index) => {
      if (index) {
        const prevItem = this.excelData[index - 1]
        if (prevItem.dest && !item.dest) {
          item.dest = this.excelData[index - 1].dest?.toString().toUpperCase().trim();
        }
        if (prevItem.date && !item.date) {
          item.date = this.excelData[index - 1].date;
        }
      }
      item.dest = (item.dest || '').toString().trim().toUpperCase()
      item.rank = item.rank?.toString().trim()
    })
  }

  private isOfficer(data: ISoldierData) {
    return ISoldierDataHelper.isOfficer(data)
  }

  private getGroupedData(data: ISoldierData[]) {
    const grouped: ITotal[] = []
    data.forEach(item => {
      if (!item.month) {
        return
      }
      const officers = this.isOfficer(item)
      const dest = grouped.find(i => i.dest === item.dest);

      if (dest) {

        dest.loan = dest.loan + (item.loan??0)

        dest.count = dest.count + 1;
        dest.officers = dest.officers + officers;
        if (dest.loan) {
          dest.loanOfficers = dest.loanOfficers + officers;
        }
      } else {
        grouped.push({dest: item.dest, count: 1, officers, loan: item.loan || 0, loanOfficers: item.loan ? officers : 0});
      }
    })
    return grouped
  }

  private getGroupedDataByDate(data: ISoldierData[]) {
    const grouped: ITotal[] = []
    data.forEach(item => {
      if (!item.month) {
        return
      }
      const officers = this.isOfficer(item)
      const dest = grouped.find(i => i.dest === item.dest);

      if (dest) {

        dest.loan = dest.loan + (item.loan??0)

        dest.count = dest.count + 1;
        dest.officers = dest.officers + officers;
        if (dest.loan) {
          dest.loanOfficers = dest.loanOfficers + officers;
        }
      } else {
        grouped.push({dest: item.dest, count: 1, officers, loan: item.loan || 0, loanOfficers: item.loan ? officers : 0});
      }
    })
    return grouped
  }

  setView(view: Views) {
    this.activeView = view;
  }

  protected readonly Views = Views

}
