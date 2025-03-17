import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filterByProp',
  standalone: true
})
export class FilterByPropPipe<T> implements PipeTransform {
  transform(array: T[], prop: keyof T, val: any) {
    return array?.filter(it => it[prop]?.toString().includes(val))
  }
}
