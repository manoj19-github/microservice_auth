import Joi, { ObjectSchema } from 'joi';

export const signupValidation: ObjectSchema = Joi.object().keys({
	username: Joi.string().min(4).max(12).required().messages({
		'string.base': 'Username must be a type string',
		'string.min': 'Invalid username',
		'string.max': 'Invalid username',
		'string.empty': 'Username is a required field'
	}),
	password: Joi.string().min(4).max(12).required().messages({
		'string.base': 'password must be a type string',
		'string.min': 'Invalid password',
		'string.max': 'Invalid password',
		'string.empty': 'password is a required field'
	}),
	country: Joi.string().required().messages({
		'string.base': 'country must be a type string',
		'string.empty': 'country is a required field'
	}),
	email: Joi.string().email().required().messages({
		'string.base': 'email must be a type string',
		'string.email': 'Invalid email',
		'string.empty': 'email is a required field'
	}),
	profilePicture: Joi.string().required().messages({
		'string.base': 'Please add a profile picture',
		'string.empty': 'profilePicture is a required field'
	})
});
