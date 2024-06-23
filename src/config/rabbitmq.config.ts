import { EnvVariable } from './envVariable.config';
import { Logger } from 'winston';
import { winstonLogger } from '@manoj19-github/microservice_shared_lib';
import client, { Channel, Connection } from 'amqplib';
import { channel } from 'diagnostics_channel';

export class RabbitMQConfig {
	public static logger: Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, `authQueueConnection`, `debug`);
	public static async createConnection(): Promise<Channel | undefined> {
		try {
			const connection: Connection = await client.connect(`${EnvVariable.RABBITMQ_ENDPOINT}`);
			const channel: Channel = await connection.createChannel();
			RabbitMQConfig.logger.info('Auth server connected to queue successfully ...........');
			return channel;
		} catch (error) {
			RabbitMQConfig.logger.error(`Authservice createConnection method error ${error}`);
			return undefined;
		}
	}
	public static closeConnection(channel: Channel, connection: Connection) {
		process.once('SIGINT', async () => {
			await channel.close();
			await connection.close();
		});
	}
}
