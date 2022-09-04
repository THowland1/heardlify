import { MongoClient, ServerApiVersion, Filter } from 'mongodb';
import { z } from 'zod';
import { ImmutableDate } from '../immutable-date';

const nullsafestring = (fallback: string) =>
	z.preprocess((val) => (val === null ? fallback : val), z.string());

const ResultSchema = z.object({
	playlistId: z.string(),
	playlistName: z.string(),
	numberOfGuesses: z.number().nullable(),
	date: z.preprocess((arg) => {
		if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
	}, z.date()),
	createdAt: z.date(),
	sid: z.string()
});
type Result = z.infer<typeof ResultSchema>;

const tryRecordStat = async (result: Result) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection('results');
	await collection.insertOne(result);
	await client.close();
};

const queryResults = async (filter: Filter<Result>) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Result>('results');
	const results = await collection.find(filter).toArray();

	await client.close();
	return results;
};

const TopPlaylistsSchema = z.array(
	z.object({
		_id: z.object({
			playlistId: z.string(),
			playlistName: z.string()
		}),
		totalQuantity: z.number()
	})
);
const getTopPlaylists = async ({
	limit,
	offset,
	from,
	to
}: {
	limit: number;
	offset: number;
	from: Date;
	to: Date;
}) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Result>('results');

	const results = await collection
		.aggregate([
			{
				$match: {
					date: {
						$gte: from,
						$lt: to
					}
				}
			},
			{
				$group: {
					_id: {
						playlistId: '$playlistId',
						playlistName: '$playlistName'
					},
					totalQuantity: { $count: {} }
				}
			},
			{ $sort: { totalQuantity: -1 } },
			{ $skip: offset },
			{ $limit: limit }
		])
		.toArray();

	await client.close();
	return TopPlaylistsSchema.parse(results);
};

const getSessionHistory = async ({
	sessionId,
	limit,
	offset,
	from,
	to
}: {
	sessionId: string;
	limit: number;
	offset: number;
	from: Date;
	to: Date;
}) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Result>('results');

	const results = await collection
		.find({
			sid: sessionId,
			date: {
				$gte: from,
				$lt: to
			}
		})
		.skip(offset)
		.limit(limit)
		.sort({ date: -1 })

		.toArray();

	await client.close();
	return results;
};

const MostActiveSessionsSchema = z.array(
	z.object({
		_id: nullsafestring('null'),
		totalQuantity: z.number()
	})
);
const getMostActiveSessions = async ({
	limit,
	offset,
	from,
	to
}: {
	limit: number;
	offset: number;
	from: Date;
	to: Date;
}) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Result>('results');

	const results = await collection
		.aggregate([
			{
				$match: {
					date: {
						$gte: from,
						$lt: to
					}
				}
			},
			{
				$group: {
					_id: '$sid',
					totalQuantity: { $count: {} }
				}
			},
			{ $sort: { totalQuantity: -1 } },
			{ $skip: offset },
			{ $limit: limit }
		])
		.toArray();

	await client.close();
	return MostActiveSessionsSchema.parse(results);
};
const ActivityByTimeSchema = z.array(
	z.object({
		_id: z.object({
			year: z.number(),
			month: z.number(),
			day: z.number(),
			hour: z.number()
		}),
		totalQuantity: z.number()
	})
);
const getActivityByTime = async ({ from, to }: { from: Date; to: Date }) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Result>('results');

	const results = await collection
		.aggregate([
			{
				$match: {
					date: {
						$gte: from,
						$lt: to
					}
				}
			},
			{
				$project: {
					y: { $year: '$date' },
					m: { $month: '$date' },
					d: { $dayOfMonth: '$date' },
					h: { $hour: '$date' }
				}
			},
			{
				$group: {
					_id: { year: '$y', month: '$m', day: '$d', hour: '$h' },
					totalQuantity: { $count: {} }
				}
			},
			{ $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
		])
		.toArray();

	await client.close();
	return ActivityByTimeSchema.parse(results);
};
const ActivityByDaySchema = z.array(
	z.object({
		_id: z.object({
			year: z.number(),
			month: z.number(),
			day: z.number()
		}),
		totalQuantity: z.number()
	})
);
const getActivityByDay = async ({ from, to }: { from: Date; to: Date }) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Result>('results');

	const results = await collection
		.aggregate([
			{
				$match: {
					date: {
						$gte: new ImmutableDate(from).setHours(0, 0, 0, 0).date,
						$lt: new ImmutableDate(to).setHours(24, 0, 0, 0).date
					}
				}
			},
			{
				$project: {
					y: { $year: '$date' },
					m: { $month: '$date' },
					d: { $dayOfMonth: '$date' }
				}
			},
			{
				$group: {
					_id: { year: '$y', month: '$m', day: '$d' },
					totalQuantity: { $count: {} }
				}
			},
			{ $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
		])
		.toArray();

	await client.close();
	return ActivityByDaySchema.parse(results);
};
const ScoresForPlaylistDaySchema = z.array(
	z.object({
		_id: z.number().nullable(),
		totalQuantity: z.number()
	})
);
const getScoresForPlaylistDay = async ({
	playlistId,
	date
}: {
	playlistId: string;
	date: Date;
}) => {
	const client = new MongoClient(process.env.MONGODB_CREDENTIALS || '', {
		serverApi: ServerApiVersion.v1
	});
	await client.connect();
	const collection = client.db('heardlify').collection<Result>('results');
	const results = await collection
		.aggregate([
			{
				$match: {
					date: {
						$gte: new ImmutableDate(date).setHours(0, 0, 0, 0).date,
						$lt: new ImmutableDate(date).setHours(24, 0, 0, 0).date
					},
					playlistId
				}
			},
			{
				$group: {
					_id: '$numberOfGuesses',
					totalQuantity: { $count: {} }
				}
			},
			{ $sort: { totalQuantity: -1 } }
		])
		.toArray();

	await client.close();
	return ScoresForPlaylistDaySchema.parse(results);
};
export default {
	tryRecordStat,
	queryResults,
	getTopPlaylists,
	getSessionHistory,
	getMostActiveSessions,
	getScoresForPlaylistDay,
	getActivityByTime,
	getActivityByDay,
	ResultSchema
};
