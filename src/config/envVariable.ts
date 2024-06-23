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
	public static API_GATEWAY_URL = process.env.API_GATEWAY_URL;
	public static NEXT_PUBLIC_GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
	public static NEXT_PUBLIC_GITHUB_CLIENT_SECRET = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;
	public static NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
	public static NEXT_PUBLIC_GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
	public static NEXT_PUBLIC_COUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_COUDINARY_CLOUD_NAME;
	public static NEXT_PUBLIC_COUDINARY_API_KEY = process.env.NEXT_PUBLIC_COUDINARY_API_KEY;
	public static NEXT_PUBLIC_CLOUDINARY_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
	public static NEXT_PUBLIC_CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
	public static GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN;
	public static JWT_TOKEN = process.env.JWT_TOKEN;
	public static REDIS_HOST = process.env.REDIS_HOST;
	public static MYSQL_DB = process.env.MYSQL_DB;
	public static PORT = process.env.PORT;
	public static SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
	public static SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
	public static MONGODB_DATABASE_URL = process.env.MONGODB_DATABASE_URL;
}
