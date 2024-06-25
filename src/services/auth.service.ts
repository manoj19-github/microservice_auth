import { IAuthBuyerMessageDetails, IAuthDocument, firstLetterUppercase, lowerCase } from '@manoj19-github/microservice_shared_lib';
import { authChannel } from '../../src';
import { AuthProducerQueue } from '../queues/authProducer.queue';
import AuthDataModel from '../schema/auth.schema';
import lodash from 'lodash';
import JWT from 'jsonwebtoken';
import { EnvVariable } from '../config/envVariable.config';
export class AuthService {
	public static async createAuthUser(payload: IAuthDocument): Promise<IAuthDocument | undefined> {
		const authResult = await AuthDataModel.create(payload);
		const messageDetails: IAuthBuyerMessageDetails = {
			username: authResult?.username ?? '',
			email: authResult?.email ?? '',
			profilePicture: authResult?.profilePicture ?? '',
			createdAt: authResult?.createdAt ?? new Date(),
			type: 'auth'
		};
		if (authChannel)
			await AuthProducerQueue.publishDirectMessage({
				channel: authChannel,
				exchangeName: 'jobber-buyer-update',
				message: JSON.stringify(messageDetails),
				routingKey: 'user-buyer',
				logMessage: `Buyer Details sent to buyer service`
			});
		const userData: IAuthDocument = lodash.omit(authResult, ['password']) as IAuthDocument;

		return userData;
	}
	public static async getAuthUserById(authId: string): Promise<IAuthDocument | undefined> {
		const userResult: IAuthDocument | undefined | null = await AuthDataModel.findById(authId);
		const userData: IAuthDocument | undefined = lodash.omit(userResult, ['password']);
		return userData;
	}
	public static async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | undefined | null> {
		const userResult: IAuthDocument | undefined | null = await AuthDataModel.findOne({
			$or: [{ username: firstLetterUppercase(username) }, { email: lowerCase(email) }]
		});
		return userResult;
	}
	public static async getUserByUsername(username: string): Promise<IAuthDocument | undefined | null> {
		const userResult: IAuthDocument | undefined | null = await AuthDataModel.findOne({
			username: firstLetterUppercase(username)
		});
		return userResult;
	}
	public static async getUserByEmail(email: string): Promise<IAuthDocument | undefined | null> {
		const userResult: IAuthDocument | undefined | null = await AuthDataModel.findOne({ email: lowerCase(email) });
		return userResult;
	}
	public static async getUserByEmailVerificationToken(token: string): Promise<IAuthDocument | undefined | null> {
		const userResult: IAuthDocument | undefined | null = await AuthDataModel.findOne({ emailVerificationToken: token });
		return userResult;
	}
	public static async getUserByPasswordToken(token: string): Promise<IAuthDocument | undefined | null> {
		const userResult: IAuthDocument | undefined | null = await AuthDataModel.findOne({
			$and: [{ passwordResetToken: token }, { passwordResetExpires: { $gt: new Date() } }]
		});
		return userResult;
	}
	public static async updateVerifyEmail({
		userId,
		emailVerified,
		emailVerifiedToken
	}: {
		userId: string;
		emailVerified: boolean;
		emailVerifiedToken: string;
	}) {
		await AuthDataModel.updateOne(
			{ _id: userId },
			{
				$set: {
					emailVerified,
					emailVerifiedToken
				}
			}
		);
	}
	public static async updatePasswordToken({ userId, token, tokenExpiration }: { userId: string; token: string; tokenExpiration: Date }) {
		await AuthDataModel.updateOne(
			{ _id: userId },
			{
				$set: {
					passwordResetToken: token,
					passwordResetExpires: tokenExpiration
				}
			}
		);
	}
	public static async updatePassword({ userId, password }: { userId: string; password: string }) {
		await AuthDataModel.updateOne(
			{ _id: userId },
			{
				$set: {
					password,
					passwordResetToken: '',
					passwordResetExpires: new Date()
				}
			}
		);
	}
	public static signJWTToken({ userId, email, username }: { userId: string; email: string; username: string }): string {
		return JWT.sign({ userId, email, username }, EnvVariable.JWT_TOKEN ?? '');
	}
}
