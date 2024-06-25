import { BadRequestError, IAuthPayload, NotAuthorizedError } from '@manoj19-github/microservice_shared_lib';
import { NextFunction, Response, Request } from 'express';
import JWT from 'jsonwebtoken';
import { EnvVariable } from '../config/envVariable.config';
import { StatusCodes } from 'http-status-codes';

export class AuthMiddleware {
	public static verifyUser(request: Request, res: Response, next: NextFunction) {
		try {
			if (!!request.headers.authorization) {
				const token = request.headers.authorization?.split(' ')?.[1];
				const payload: IAuthPayload = JWT.verify(token, `${EnvVariable.JWT_TOKEN}`) as IAuthPayload;
				request.currentUser = payload;
				next();
			} else {
				return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'please login first and then try again' });
			}
		} catch (error) {
			console.log('error: ', error);
			return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'please login first and then try again' });
		}
	}

	// check authentication
	public static checkAuthentication(request: Request, res: Response, next: NextFunction) {
		try {
			if (!request?.currentUser) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'please login first and then try again' });

			next();
		} catch (error) {
			console.log('error: ', error);
			return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'please login first and then try again' });
		}
	}
}
