import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {

  public transform(value: string, length?: number, suffix: string = '...'): string {
    const truncationLength: number = length ?? 20;

    return value.length > truncationLength
		? `${value.slice(0, Math.ceil(truncationLength)).trim()}${suffix}`
		: value;
  }
}