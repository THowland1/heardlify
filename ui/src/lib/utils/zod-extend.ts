import type { z, ZodType } from 'zod';

function is<TSchema extends ZodType>(schema: TSchema) {
	return function (value: unknown): value is z.infer<TSchema> {
		return schema.safeParse(value).success;
	};
}

export const zz = {
	is
};
