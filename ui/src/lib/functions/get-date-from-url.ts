export function getDateFromURL(url: URL) {
	const value = url.searchParams.get('date');
	if (!value) return new Date();
	const dateValue = Date.parse(value);
	return isNaN(dateValue) ? new Date() : new Date(dateValue);
}
