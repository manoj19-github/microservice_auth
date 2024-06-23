import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
	BadRequestError,
	IAuthDocument,
	IEmailMessageDetails,
	ServerError,
	firstLetterUppercase,
	lowerCase,
	uploads
} from '@manoj19-github/microservice_shared_lib';
import { v4 as uuidV4 } from 'uuid';
import { UploadApiResponse } from 'cloudinary';
import crypto from 'node:crypto';
import { EnvVariable } from 'src/config/envVariable.config';
import { AuthProducerQueue } from 'src/queues/authProducer.queue';
import { authChannel } from 'src';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
	public static async createUser(request: Request, response: Response, next: NextFunction) {
		try {
			const { username, email, password, country, profilePicture } = request.body;
			const checkUserExists = await AuthService.getUserByUsernameOrEmail(username, email);
			if (!!checkUserExists) throw new BadRequestError('Invalid credentials, username or email is already used', 'invalid input');
			const profilePublicId: string = uuidV4();
			//***************   upload user profile picture to cloudinary service ************************//
			const uploadResult: UploadApiResponse = (await uploads(profilePicture, `${profilePublicId}`, true, true)) as UploadApiResponse;
			if (!uploadResult || !uploadResult?.public_id) throw new BadRequestError(`File profile picture upload error `, `Try again later`);
			const randomString: string = await Promise.resolve(crypto.randomBytes(64).toString('hex'));
			const payload: IAuthDocument = {
				profilePublicId,
				password,
				country,
				username: firstLetterUppercase(username),
				email: lowerCase(email),
				profilePicture: uploadResult?.secure_url ?? '',
				emailVerificationToken: randomString
			} as IAuthDocument;
			const result: IAuthDocument | undefined = await AuthService.createAuthUser(payload);
			if (!result) throw new ServerError('user not created', 'Something went wrong');
			const verifyLink: string = `${EnvVariable.CLIENT_URL}/confirm_email?v_token=${randomString}`;
			const messagePayload: IEmailMessageDetails = {
				verifyLink,
				template: 'verifyEmail',
				receiverEmail: result.email ?? ''
			};
			if (!!authChannel)
				await AuthProducerQueue.publishDirectMessage({
					channel: authChannel,
					exchangeName: `jobber-email-notification`,
					routingKey: `auth-email`,
					message: JSON.stringify(messagePayload),
					logMessage: 'Verify email message has been sent to notification service .'
				});
			const JWTToken: string = AuthService.signJWTToken({ userId: result._id, email: result.email ?? '', username: result.username ?? '' });
			return response.status(StatusCodes.CREATED).json({
				message: 'user created successfully',
				user: result,
				JWTToken
			});
		} catch (error) {
			console.log('error in createUser of AuthController', error);
			next(error);
		}
	}
}
