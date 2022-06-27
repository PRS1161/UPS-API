import { celebrate, Joi } from 'celebrate';

const ADMIN_SCHEMA = {
	REGISTER: celebrate({
		body: Joi.object({
			firstName: Joi.string().trim().required().messages({
				"string.empty": "First name is not allowed to be empty",
				"string.base": "First name must be a string",
				"any.required": "First name is required"
			}),
			lastName: Joi.string().trim().required().messages({
				"string.empty": "Last name is not allowed to be empty",
				"string.base": "Last name must be a string",
				"any.required": "Last name is required"
			}),
			email: Joi.string().trim().email().required().messages({
				"string.empty": "Email is not allowed to be empty",
				"string.base": "Email must be a string",
				"string.email": "Valid email required",
				"any.required": "Email is required"
			}),
			password: Joi.string().trim().required().messages({
				"string.empty": "Password is not allowed to be empty",
				"string.base": "Password must be a string",
				"any.required": "Password is required"
			})
		})
	}),
	LOGIN: celebrate({
		body: Joi.object({
			email: Joi.string().trim().email().required().messages({
				"string.empty": "Email is not allowed to be empty",
				"string.base": "Email must be a string",
				"string.email": "Valid email required",
				"any.required": "Email is required"
			}),
			password: Joi.string().trim().required().messages({
				"string.empty": "Password is not allowed to be empty",
				"string.base": "Password must be a string",
				"any.required": "Password is required"
			})
		})
	}),
	UPDATE_PROFILE: celebrate({
		body: Joi.object({
			firstName: Joi.string().trim().optional().messages({
				"string.empty": "First name is not allowed to be empty",
				"string.base": "First name must be a string"
			}),
			lastName: Joi.string().trim().optional().messages({
				"string.empty": "Last name is not allowed to be empty",
				"string.base": "Last name must be a string"
			}),
			email: Joi.string().trim().email().optional().messages({
				"string.empty": "Email is not allowed to be empty",
				"string.base": "Email must be a string",
				"string.email": "Valid email required"
			}),
		})
	}),
	CHANGE_PASSWORD: celebrate({
		body: Joi.object({
			oldPassword: Joi.string().required().messages({
				"string.empty": "Old password is not allowed to be empty",
				"string.base": "Old password must be string",
				"any.required": "Old password is required"
			}),
			newPassword: Joi.string().not(Joi.ref('oldPassword')).required().messages({
				"string.empty": "New password is not allowed to be empty",
				"any.invalid": "New password contains a invalid value.",
				"any.required": "New password is required"
			}),
		})
	}),
};

export { ADMIN_SCHEMA };