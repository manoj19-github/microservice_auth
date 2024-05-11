import { config } from 'dotenv';

config();
export class EnvVariable {
	public static ENABLE_APM = process.env.ENABLE_APM;
	public static NODE_ENV = process.env.NODE_ENV;
	public static CLIENT_URL = process.env.CLIENT_URL;
	public static RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT;
	public static SENDER_EMAIL = process.env.SENDER_EMAIL;
	public static SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
	public static ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL;
	public static ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL;
	public static ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN;
	public static EMAIL_QUEUE_EXCHANGE_NAME = process.env.EMAIL_QUEUE_EXCHANGE_NAME;
	public static GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN;
	public static JWT_TOKEN = process.env.JWT_TOKEN;
	public static SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
	public static SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
	public static AUTH_BASE_URL = process.env.AUTH_BASE_URL;
	public static USERS_BASE_URL = process.env.USERS_BASE_URL;
	public static GIG_BASE_URL = process.env.GIG_BASE_URL;
	public static MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL;
	public static ORDER_BASE_URL = process.env.ORDER_BASE_URL;
	public static REVIEW_BASE_URL = process.env.REVIEW_BASE_URL;
	public static REDIS_HOST = process.env.REDIS_HOST;
}
