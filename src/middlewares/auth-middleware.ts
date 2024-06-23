import { BadRequestError, IAuthPayload, NotAuthorizedError } from '@manoj19-github/microservice_shared_lib';
import { NextFunction, Response, Request } from 'express';
import JWT from 'jsonwebtoken';
import { EnvVariable } from '../config/envVariable.config';

class AuthMiddleware {
	public verifyUser(request: Request, res: Response, next: NextFunction): void {
		try {
			if (!request.headers.authorization)
				throw new NotAuthorizedError('Token not avilable. Please login again', 'Gateway service verifyuser method error');
			const token = request.headers.authorization;
			const payload: IAuthPayload = JWT.verify(token, `${EnvVariable.JWT_TOKEN}`) as IAuthPayload;
			request.currentUser = payload;
			next();
		} catch (error) {
			console.log('error: ', error);
			throw new NotAuthorizedError('Token not avilable. Please login again', 'Gateway service verifyuser method error');
		}
	}

	// check authentication
	public checkAuthentication(request: Request, res: Response, next: NextFunction): void {
		try {
			if (!request?.currentUser)
				throw new BadRequestError('Authentication is required to access this route', 'gateway service check authentication method error');

			next();
		} catch (error) {
			console.log('error: ', error);
			throw new NotAuthorizedError('Token not avilable. Please login again', 'Gateway service verifyuser method error');
		}
	}
}
export const authMiddleware: AuthMiddleware = new AuthMiddleware();
