import {Pipe, PipeTransform} from '@angular/core';
import {StringUtil} from '../utils/string.util';

@Pipe({ name: 'filter', pure: true })
export class FilterPipe implements PipeTransform {
	transform(array: any[], filter: string, emptyShowNone?: boolean, keys?: string[], matchAllTerms = true) {
		if (!filter || !filter.toLowerCase) {
			return emptyShowNone ? [] : array;
		} else if (array) {
			const cmp: string = filter.toLowerCase();
			const terms: Array<string> = cmp.split(' ');
			return array.filter(item => {
				const matchesItem = (term: string) => {
					const filterKeys = keys || Object.keys(item);
					for (const key of filterKeys) {
						if (item.hasOwnProperty(key)) {
							if (typeof item[key] === 'string') {
								if (item[key] && item[key].toLowerCase().indexOf(term) !== -1) {
									return true;
								}
							} else if (typeof item[key] === 'number') {
								if (item[key]) {
									const numStr = StringUtil.removeAllWhitespace(term).replace(',', '.');
									if (StringUtil.isNumeric(numStr) && Number(numStr) == item[key]) {
										return true;
									}
								}
							}
						}
					}
					return false;
				};
				return matchAllTerms ? terms.every(matchesItem) : terms.some(matchesItem);
			});
		}
	}
}
