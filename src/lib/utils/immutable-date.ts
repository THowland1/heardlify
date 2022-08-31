export class ImmutableDate {
	private _date: Date;

	constructor();
	constructor(date: string | number | Date);
	constructor(date?: string | number | Date) {
		this._date = date === undefined ? new Date() : new Date(date);
	}

	get date() {
		return new Date(this._date);
	}

	setHours(...args: Parameters<typeof Date.prototype.setHours>) {
		const newDate = this.date;
		newDate.setHours(...args);
		return new ImmutableDate(newDate);
	}
}
