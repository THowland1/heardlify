const MS_IN_S = 1000;
const MS_IN_MINUTE = 60 * MS_IN_S;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

function addTime(date: Date, ms: number): Date {
	const copy = new Date(date);
	copy.setTime(copy.getTime() + ms);
	return copy;
}

/** The number of full days since Thursday Jan 1st 00:00:00.000, local time */
export class EpochDay {
	static fromDate(date: Date): number {
		const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
		const localdate = new Date(timestamp);
		return Math.floor(localdate.valueOf() / MS_IN_DAY);
	}
	static toDate(epochday: number): Date {
		const midnightOfEpochDayInUTC = new Date(epochday * MS_IN_DAY);
		const midnightOfEpochDayInLocalTime = addTime(
			midnightOfEpochDayInUTC,
			midnightOfEpochDayInUTC.getTimezoneOffset() * 60000
		);
		return midnightOfEpochDayInLocalTime;
	}
}
