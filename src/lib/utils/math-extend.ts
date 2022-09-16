function percent(top: number, bottom: number) {
	let num;
	if (bottom === 0) {
		num = 0;
	} else {
		num = top / bottom;
	}
	const str = num.toLocaleString(undefined, {
		style: 'percent',
		minimumFractionDigits: 0,
		maximumFractionDigits: 1
	});
	return str;
}
function minAndMax(...values: number[]): [number, number] {
	return [Math.min(...values), Math.max(...values)];
}
function sum(...values: number[]) {
	let sum = 0;
	values.forEach((value) => (sum += value));
	return sum;
}

export const MMath = {
	percent,
	minAndMax,
	sum
};
