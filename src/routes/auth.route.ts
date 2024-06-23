import { AuthController } from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import { payloadValidator } from '../middlewares/payloadValidator.middleware';
import { signupValidation } from '../validations/signup.validation';

export class AuthRoutes implements Routes {
	path = '/auth';
	router: Router = Router();
	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes(): void {
		this.router.post(`${this.path}/signup`, payloadValidator(signupValidation), AuthController.createUser);
	}
}
