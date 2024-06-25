import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
	BadRequestError,
	IAuthDocument,
	IEmailMessageDetails,
	ServerError,
	firstLetterUppercase,
	isEmail,
	lowerCase,
	uploads
} from '@manoj19-github/microservice_shared_lib';
import { v4 as uuidV4 } from 'uuid';
import { UploadApiResponse } from 'cloudinary';
import crypto from 'node:crypto';
import { EnvVariable } from '../config/envVariable.config';
import { AuthProducerQueue } from '../queues/authProducer.queue';
import { authChannel } from '..';
import { StatusCodes } from 'http-status-codes';
import AuthDataModel from 'src/schema/auth.schema';
import lodash from 'lodash';

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
			const userDetails = JSON.parse(JSON.stringify(result));
			userDetails.password = null;
			return response.status(StatusCodes.CREATED).json({
				message: 'user created successfully',
				user: userDetails,
				JWTToken
			});
		} catch (error) {
			next(error);
		}
	}
	public static async login(request: Request, response: Response, next: NextFunction) {
		try {
			const { username, password } = request.body;

			const isValidEmail: boolean = isEmail(username);
			const existingUser: any = !isValidEmail ? await AuthService.getUserByUsername(username) : await AuthService.getUserByEmail(username);

			if (!existingUser) throw new BadRequestError(`Invalid credentials`, `login method error`);
			const passwordMatch: boolean = await existingUser.authenticate(password);
			if (!passwordMatch) throw new BadRequestError(`Invalid credentials`, `login method error`);
			const jwtToken: string = AuthService.signJWTToken({
				userId: existingUser._id ?? '',
				username: existingUser.username ?? '',
				email: existingUser.email ?? ''
			});
			const userDetails = JSON.parse(JSON.stringify(existingUser));
			userDetails.password = null;

			return response.status(StatusCodes.OK).json({ message: 'User login successfully', user: userDetails, token: jwtToken });
		} catch (error) {
			next(error);
		}
	}
	public static async verifyEmail(request: Request, response: Response, next: NextFunction) {
		try {
			const { token } = request.body;
			const isUserExists: IAuthDocument | null | undefined = await AuthService.getUserByPasswordToken(token);
			if (!isUserExists) throw new BadRequestError('invalid token', 'user not exists');
			await AuthService.updateVerifyEmail({
				userId: isUserExists?._id ?? '',
				emailVerified: true,
				emailVerifiedToken: isUserExists.passwordResetToken ?? ''
			});
			const updatedUser: IAuthDocument | null | undefined = await AuthService.getAuthUserById(isUserExists?._id ?? '');
			return response.status(StatusCodes.OK).json({ message: 'User updated successfully', user: updatedUser });
		} catch (error) {
			next(error);
		}
	}
	public static async forgotPassword(request: Request, response: Response, next: NextFunction) {
		try {
			const { email } = request.body;
			const existingUser: IAuthDocument | null | undefined = await AuthService.getUserByEmail(email);
			if (!existingUser) throw new BadRequestError('Invalid credentials', 'please check user input');
			const randomString: string = await Promise.resolve(crypto.randomBytes(64).toString('hex'));
			const expiryDate: Date = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);
			await AuthService.updatePasswordToken({ userId: existingUser._id ?? '', token: randomString, tokenExpiration: expiryDate });
			const resetLink: string = `${EnvVariable.CLIENT_URL}/reset_password?token=${randomString}`;
			const messageDetails: IEmailMessageDetails = {
				receiverEmail: existingUser.email ?? '',
				resetLink,
				username: existingUser?.username,
				template: 'forgotPassword'
			};
			if (!!authChannel)
				await AuthProducerQueue.publishDirectMessage({
					channel: authChannel,
					exchangeName: 'jobber-email-notification',
					routingKey: 'auth-email',
					message: JSON.stringify(messageDetails),
					logMessage: 'Forgot password message sent to notification service'
				});
			return response.status(StatusCodes.OK).json({
				message: 'Password reset link successfully'
			});
		} catch (error) {
			next(error);
		}
	}
}
