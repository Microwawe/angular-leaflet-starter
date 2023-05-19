

export class StringUtil {

	private static NBSP_UNICODE = '\u00A0';

	public static isLetter(c: string): boolean {
		if (!c) {
			return false;
		}

		return c.toLowerCase() !== c.toUpperCase();
	}

	public static isNumeric(str: string): boolean {
		return !isNaN(<any>str);
	}

	public static replaceAll(str: string, from: string, to: string): string {
		if (str) {
			return str.replace(new RegExp(from, 'g'), to);
		} else {
			return str;
		}
	}

	public static removeAllWhitespace(str: string): string {
		if (str) {
			return str.replace(/\s/g, '');
		} else {
			return str;
		}
	}

	public static removeAllNoBreakSpace(str: string): string {
		return str.replace(new RegExp(this.NBSP_UNICODE, 'g'), '');
	}

	public static isMatch(str1: string, str2: string): boolean {
		if (!str1 && !str2) {
			return true;
		} else if (!str1 || !str2) {
			return false;
		}
		return this.removeAllWhitespace(String(str1).toUpperCase()) === this.removeAllWhitespace(String(str2).toUpperCase());
	}


	// Date in dd.mm.yyyy -format, handles also leap years
	public static isDate(str: string): boolean {
		let regex = new RegExp('^(?:(?:31(\\.)(?:0[13578]|1[02]))\\1|(?:(?:29|30)(\\.)(?:0[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)\\d{2})$|' +
			'^(?:29(\\.)02\\3(?:(?:(?:1[6-9]|[2-9]\\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|' +
			'^(?:0[1-9]|1\\d|2[0-8])(\\.)(?:(?:0[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)\\d{2})$');

		return regex.test(str);
	}

	public static transformWhiteSpaceToNoBreakSpace(str: string): string {
		return str.replace(new RegExp(' ', 'g'), this.NBSP_UNICODE);
	}

	public static emptyToUndefined(text: string): string {
		return text || undefined;
	}

}

