import { MongoClient, ServerApiVersion } from 'mongodb';
import { z } from 'zod';

export const ResultSchema = z.object({
	playlistId: z.string(),
	playlistName: z.string(),
	numberOfGuesses: z.number().nullable(),
	date: z.preprocess((arg) => {
		if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
	}, z.date()),
	sid: z.string()
});
export type Result = z.infer<typeof ResultSchema>;

const tryRecordStat = async (result: Result) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection('results');
	await collection.insertOne(result);
	await client.close();
};

export default { tryRecordStat };
