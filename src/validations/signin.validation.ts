import Joi, { ObjectSchema } from 'joi';

export const signinValidation: ObjectSchema = Joi.object().keys({
	username: Joi.alternatives().conditional(Joi.string().email(), {
		then: Joi.string().min(4).max(12).required().messages({
			'string.base': 'Email must be a type string',
			'string.email': 'Invalid email',
			'string.empty': 'Email is a required field'
		}),
		otherwise: Joi.string().min(4).max(12).required().messages({
			'string.base': 'Username must be a type string',
			'string.min': 'Invalid username',
			'string.max': 'Invalid username',
			'string.empty': 'Username is a required field'
		})
	}),
	password: Joi.string().min(4).max(12).required().messages({
		'string.base': 'password must be a type string',
		'string.min': 'Invalid password',
		'string.max': 'Invalid password',
		'string.empty': 'password is a required field'
	})
});

export const resendEmailValidation: ObjectSchema = Joi.object().keys({
	email: Joi.string().email().required().messages({
		'string.base': 'email must be a type string',
		'string.email': 'Invalid email',
		'string.empty': 'email is a required field'
	}),
	userId: Joi.string().required().messages({
		'string.base': 'password must be a type string',
		'string.empty': 'password is a required field'
	})
});