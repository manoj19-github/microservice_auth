import { EnvVariable } from '../config/envVariable.config';
import { Logger } from 'winston';
import { winstonLogger } from '@manoj19-github/microservice_shared_lib';
import { Channel } from 'amqplib';
import { RabbitMQConfig } from '../config/rabbitmq.config';

export class AuthProducerQueue {
	private static logger: Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, `authProducerQueue`, `debug`);
	public static async publishDirectMessage({
		logMessage,
		channel,
		exchangeName,
		routingKey,
		message
	}: {
		channel: Channel;
		exchangeName: string;
		routingKey: string;
		message: string;
		logMessage: string;
	}): Promise<void> {
		try {
			if (!channel) channel = (await RabbitMQConfig.createConnection()) as Channel;
			await channel.assertExchange(exchangeName, 'direct');
			channel.publish(exchangeName, routingKey, Buffer.from(message));
			AuthProducerQueue.logger.info(logMessage);
		} catch (error) {
			AuthProducerQueue.logger.log(`error`, 'AuthProducerQueu publishDirectMessage Error', error);
		}
	}
}
