import { MongoClient, ServerApiVersion } from 'mongodb';

const LOGGER_LEVELS = {
	fatal: { level: 'fatal', severity: 5 },
	error: { level: 'error', severity: 4 },
	warn: { level: 'warn', severity: 3 },
	info: { level: 'info', severity: 2 },
	debug: { level: 'debug', severity: 1 },
	trace: { level: 'trace', severity: 0 }
} as const;

export class Logger<
	T extends Record<string, unknown> & {
		sessionId: string;
		eventName: string;
	} & typeof LOGGER_LEVELS[keyof typeof LOGGER_LEVELS]
> {
	static LOGGER_LEVELS = LOGGER_LEVELS;
	logs: T[] = [];

	log(...data: T[]) {
		this.logs.push(...data.map((o) => ({ ...o, date: new Date() })));
	}

	async tryFlush() {
		try {
			const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
				serverApi: ServerApiVersion.v1
			});
			await client.connect();
			const collection = client.db('heardlify').collection('logs');
			await collection.insertMany(this.logs);
			await client.close();
		} catch (error) {
			console.error(error, this.logs);
		}
	}
}
