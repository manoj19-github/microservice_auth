import Joi, { ObjectSchema } from 'joi';

export const emailValidation: ObjectSchema = Joi.object().keys({
	email: Joi.string().email().required().messages({
		'string.base': 'Field must be valid type',
		'string.required': 'Field must be valid',
		'string.email': 'email is not valid'
	})
});

export const passwordValidation: ObjectSchema = Joi.object().keys({
	password: Joi.string().min(4).max(12).required().messages({
		'string.base': 'Username must be a type string',
		'string.min': 'Invalid username',
		'string.max': 'Invalid username',
		'string.empty': 'Username is a required field'
	}),
	confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
		'any.only': 'Password should match',
		'any.required': 'Confirm password is a required field'
	})
});

export const changePasswordValidation: ObjectSchema = Joi.object().keys({
	currentPassword: Joi.string().required().min(4).max(12).messages({
		'string.base': 'Password should be of type string',
		'string.min': 'Invalid password',
		'string.max': 'Invalid password',
		'string.empty': 'Password is a required field'
	}),
	newPassword: Joi.string().required().valid(Joi.ref('password')).messages({
		'any.only': 'Password should match',
		'any.required': 'Confirm password is a required field'
	})
});
