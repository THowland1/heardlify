export default function (err: unknown): Record<string, unknown> {
	try {
		return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
	} catch (error) {
		return { jsonifyerrormessage: 'jsonify-error failed' };
	}
}
