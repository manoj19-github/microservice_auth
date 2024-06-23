import { BadRequestError } from '@manoj19-github/microservice_shared_lib';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectSchema } from 'joi';

export const payloadValidator = (schema: ObjectSchema) => async (request: Request, response: Response, next: NextFunction) => {
	const { error } = await Promise.resolve(schema.validate(request.body));
	if (!!error && error?.details)
		return response.status(StatusCodes.BAD_REQUEST).json({
			message: error?.details?.[0]?.message || 'Something went wrong',
			title: 'invalid user input'
		});
	return next();
};
