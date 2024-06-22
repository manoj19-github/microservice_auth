import { Routes } from '../interfaces/routes.interface';
import { Application } from 'express';

class RoutesMain {
	private routes: Routes[] = []; // add all routes  here
	constructor() {}
	public initializeAllRoutes(app: Application) {
		this.routes.forEach((route) => {
			app.use('/api-gateway/', route.router);
		});
	}
}

export default RoutesMain;
