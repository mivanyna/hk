import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'excelDate',
  standalone: true
})
export class ExcelDatePipe implements PipeTransform {
  transform(date: number): Date {
    return new Date(Math.round((date - 25569)*86400*1000))
  }
}
