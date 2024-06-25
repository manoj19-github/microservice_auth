import { AuthController } from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import { payloadValidator } from '../middlewares/payloadValidator.middleware';
import { signupValidation } from '../validations/signup.validation';
import { resendEmailValidation, signinValidation } from '../validations/signin.validation';
import { changePasswordValidation, emailValidation, passwordValidation } from '../validations/utils.validation';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes implements Routes {
	path = '/auth';
	router: Router = Router();
	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes(): void {
		this.router.post(`${this.path}/signup`, payloadValidator(signupValidation), AuthController.createUser);
		this.router.post(`${this.path}/signin`, payloadValidator(signinValidation), AuthController.login);
		this.router.put(`${this.path}/verify-email`, AuthController.verifyEmail);
		this.router.put(`${this.path}/forgot-password`, payloadValidator(emailValidation), AuthController.forgotPassword);
		this.router.put(`${this.path}/reset-password/:token`, payloadValidator(passwordValidation), AuthController.resetPassword);
		this.router.put(
			`${this.path}/change-password`,
			payloadValidator(changePasswordValidation),
			AuthMiddleware.verifyUser,
			AuthController.changePassword
		);
		this.router.get(`${this.path}/current-user`, AuthMiddleware.verifyUser, AuthController.getCurrentUser);
		this.router.put(`${this.path}/resend-email`, payloadValidator(resendEmailValidation), AuthController.resendEmail);
	}
}
