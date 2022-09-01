import { MongoClient, ServerApiVersion } from 'mongodb';
import { z } from 'zod';

const FeedbackSchema = z.object({
	content: z.string(),
	createdAt: z.date(),
	sid: z.string()
});
type Feedback = z.infer<typeof FeedbackSchema>;

const post = async (feedback: Feedback) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Feedback>('feedback');
	await collection.insertOne(feedback);
	await client.close();
};

const get = async ({
	offset,
	limit,
	from,
	to
}: {
	offset: number;
	limit: number;
	from: Date;
	to: Date;
}) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Feedback>('feedback');

	const results = await collection
		.find({
			createdAt: {
				$gte: from,
				$lt: to
			}
		})
		.skip(offset)
		.limit(limit)
		.sort({ createdAt: -1 })
		.toArray();

	await client.close();
	return results;
};

export default {
	FeedbackSchema,
	post,
	get
};
