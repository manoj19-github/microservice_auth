import { winstonLogger } from '@manoj19-github/microservice_shared_lib';
import { Logger } from 'winston';
import { EnvVariable } from './envVariable';
import { Sequelize } from 'sequelize';
const logger: Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'AUTH service mysql db connection container', 'debug');

export const sequelize = new Sequelize({
	dialect: 'mysql',
	logging: false,
	dialectOptions: {
		multipleStatements: true
	}
});
