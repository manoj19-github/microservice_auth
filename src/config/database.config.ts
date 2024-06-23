import { winstonLogger } from '@manoj19-github/microservice_shared_lib';
import { Logger } from 'winston';
import { EnvVariable } from './envVariable.config';
import mongoose from 'mongoose';
const logger: Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'AUTH service Mongo db connection container', 'debug');

export const ConnectDatabase = async () => {
	try {
		await mongoose.set('strictQuery', true);
		await mongoose.connect(EnvVariable.MONGODB_DATABASE_URL!, {
			connectTimeoutMS: 15000
		});
	} catch (error) {
		logger.error(`Database not connected : ${error} `);
	}
	const { connection } = mongoose;
	if (connection.readyState >= 1) {
		console.log(`database  connected`);
		logger.info(`Database  connected  successfully `);
		return;
	}
	connection.on('error', () => {
		console.log(`database not connected try again later`);
	});
};
