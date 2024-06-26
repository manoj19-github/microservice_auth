import { Client } from '@elastic/elasticsearch';
import { EnvVariable } from './envVariable.config';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@manoj19-github/microservice_shared_lib';

const logger: Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'apiGateway Elasticsearch connection', 'debug');
console.log('EnvVariable.ELASTIC_SEARCH_URL : ', EnvVariable.ELASTIC_SEARCH_URL);
const ElasticSearchClient = new Client({
	node: `${EnvVariable.ELASTIC_SEARCH_URL}`
});

export async function checkElasticSearchConnection(): Promise<void> {
	let isConnected = false;
	while (!isConnected) {
		try {
			const health: ClusterHealthResponse = await ElasticSearchClient.cluster.health({});
			logger.info(`AuthService Elasticsearch health status  - ${health.status}`);
			isConnected = true;
		} catch (error) {
			logger.error(`Connection to Elasticsearch is failed. in auth service Retrying ...............`);
			logger.log(`error`, `AuthService  checkElasticSearchConnection method :`, error);
		}
	}
}
