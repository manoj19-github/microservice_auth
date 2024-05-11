import 'express-async-errors';
import cors from 'cors';
import { config } from 'dotenv';
import express, { Application, Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import { errorHandler, notFound } from './middlewares/errorHandler.middleware';
import RoutesMain from './routes';
import { Logger } from 'winston';
import { EnvVariable } from './config/envVariable';
import { StatusCodes } from 'http-status-codes';
import { checkElasticSearchConnection } from './config/elasticSearch.config';

// import { Channel } from 'amqplib';

import { winstonLogger } from '@manoj19-github/microservice_shared';
import hpp from 'hpp';
import compression from 'compression';
config();
class APIGatewayServer {
	private app: Application;
	private PORT: unknown;
	private routesMain = new RoutesMain();
	private logger: Logger;
	constructor() {
		this.logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'GatewayServer', 'debug');
		this.app = express();
		this.PORT = process.env.PORT ?? 5000;
		this.securityMiddleware();
		this.standardMiddleware();
		this.routesMiddleware();
	}
	private securityMiddleware(): void {
		this.app.set(`trust proxy`, 1);
		this.app.use(
			cookieSession({
				name: 'session',
				keys: [`${EnvVariable.SECRET_KEY_ONE}`,`${EnvVariable.SECRET_KEY_TWO}`],
				maxAge: 60 * 60 * 60 * 24,
				secure: EnvVariable.NODE_ENV !=="development" /*ok*/
			})
		); // max age is 1 day or 24 hour
		this.app.use(hpp());
		this.app.use(cors({ credentials: true, origin: `${EnvVariable.CLIENT_URL}`, methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'] }));

		this.app.use(helmet());
		this.app.use(morgan('dev'));
	}
	private standardMiddleware():void{
		this.app.use(compression());
		this.app.use(urlencoded({ extended: true, limit: '200mb' }));
		this.app.use(json({ limit: '200mb' }));

		

	}
	private routesMiddleware(): void {
		this.app.get('/gateway-health', (req: Request, res: Response) => {
			return res.status(StatusCodes.OK).send('<h2>API gateway Server is running .....</h2>');
		});
		this.routesMain.initializeAllRoutes(this.app);

		// put this at the last of all routes
		this.app.use(notFound);
		this.app.use(errorHandler);
	}
	public listen(): void {
		this.startServer();
		// this.startQueue();
		this.startElasticSearch();
	}
	// private async startQueue(): Promise<void> {
	// 	const emailChannel:Channel = await QueueConnection.createConnection() as Channel;
	// 	await EmailConsumer.consumeAuthEmailMessages(emailChannel);
	// 	await EmailConsumer.consumeOrderEmailMessages(emailChannel);
	// 	await emailChannel.assertExchange(String(EnvVariable.EMAIL_QUEUE_EXCHANGE_NAME),'direct');
	// 	const routingKey = 'auth-email-notification';
	//     const queueName = 'auth-email-queue';
	// 	const messages1 = JSON.stringify({name:"Auth Email",service:"Auth Notification service"})
	// 	emailChannel.publish(String(EnvVariable.EMAIL_QUEUE_EXCHANGE_NAME),routingKey,Buffer.from(messages1));

	// 	// const messages2:any = {
	// 	// 	verifyLink:`${EnvVariable.CLIENT_URL}/confirm_email?v_token=4343edferfde4343`,
	// 	// 	receiverEmail:`${EnvVariable.SENDER_EMAIL}`,
	// 	// 	template:'verifyEmail/html.ejs',
	// 	// 	subject:"test email"

	// 	// }
	// 	// await emailChannel.assertExchange('jobber-order-notification','direct');
	// 	// emailChannel.publish('jobber-order-notification','order-email',Buffer.from(JSON.stringify(messages2)));

	// }
	private async startElasticSearch(): Promise<void> {
		await checkElasticSearchConnection()
	}
	private startServer(): void {
		try {
			const httpServer: http.Server = new http.Server(this.app);
			this.logger.info(`worker with process id of ${process.pid} of Gateway server has started`);
			httpServer.listen(this.PORT, () => {
				this.logger.info(`Gateway Server running on port ${this.PORT}`);
			});
		} catch (error) {
			this.logger.log('error', 'Gateway Service start Server error : ', error);
		}
	}
}

const server = new APIGatewayServer();
server.listen();
