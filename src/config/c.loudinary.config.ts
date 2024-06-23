import cloudinary from 'cloudinary';
import { EnvVariable } from './envVariable.config';
export const cloudinaryConfig = (): void => {
	cloudinary.v2.config({
		cloud_name: EnvVariable.NEXT_PUBLIC_COUDINARY_CLOUD_NAME,
		api_key: EnvVariable.NEXT_PUBLIC_COUDINARY_API_KEY,
		api_secret: EnvVariable.NEXT_PUBLIC_CLOUDINARY_API_SECRET
	});
};
