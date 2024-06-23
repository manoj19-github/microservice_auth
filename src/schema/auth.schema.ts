import Mongoose from 'mongoose';
import { IAuthDocument } from '@manoj19-github/microservice_shared_lib';
import { IUserAuthenticateMethods } from '../interfaces/auth.interface';
import bcrypt from 'bcrypt';
import validator from 'validator';
type AuthModelType = Mongoose.Model<IAuthDocument, {}, IUserAuthenticateMethods>;

const AuthSchema = new Mongoose.Schema<IAuthDocument, AuthModelType, IUserAuthenticateMethods>(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate(val: string) {
				if (!validator.isEmail(val)) throw new Error(`email is not valid`);
			}
		},
		profilePublicId: {
			type: String,
			required: true
		},
		country: {
			type: String,
			required: true
		},
		profilePicture: {
			type: String,
			required: false
		},
		emailVerificationToken: {
			type: String,

			required: false
		},
		emailVerified: {
			type: Boolean,
			default: false,
			required: true
		},
		passwordResetToken: {
			type: String,
			required: false
		},
		passwordResetExpires: {
			type: Date,
			required: true,
			default: new Date()
		}
	},
	{ timestamps: true }
);

AuthSchema.pre('save', async function (next) {
	if (!this.isModified) next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(String(this.password), salt);
});

AuthSchema.methods = {
	authenticate: async function (password: string) {
		return await bcrypt.compare(password, String(this.password));
	}
};
const AuthDataModel: any = Mongoose.model('Auth', AuthSchema);
export default AuthDataModel;
