import { Routes } from '../interfaces/routes.interface';
import { Application } from 'express';
import { AuthRoutes } from './auth.route';
import { verifyGatewayRequest } from '@manoj19-github/microservice_shared_lib';

class RoutesMain {
	private path: string = `/api/v1/`;
	private routes: Routes[] = [new AuthRoutes()]; // add all routes  here

	constructor() {}
	public initializeAllRoutes(app: Application) {
		this.routes.forEach((route) => {
			app.use(this.path, verifyGatewayRequest, route.router);
		});
	}
}

export default RoutesMain;
