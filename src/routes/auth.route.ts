import { AuthController } from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import { payloadValidator } from '../middlewares/payloadValidator.middleware';
import { signupValidation } from '../validations/signup.validation';
import { signinValidation } from '../validations/signin.validation';
import { emailValidation } from 'src/validations/utils.validation';

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
	}
}
