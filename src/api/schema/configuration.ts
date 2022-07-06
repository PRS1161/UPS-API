import { celebrate, Joi } from 'celebrate';
import JoiObjectId from "joi-objectid";

const objectId = JoiObjectId(Joi);

const CONFIGURATION_SCHEMA = {
    CREATE_CONFIGURATION: celebrate({
        body: Joi.object({
            attribute: Joi.number().integer().required().messages({
                "number.base": "Attribute must be a number",
                "any.required": "Attribute is required"
            }),
            settings: Joi.array().min(1).items(Joi.object().required()).required().messages({
                "array.min": "Settings not be an empty array",
                "array.base": "Settings must be an array",
                "any.required": "Settings is required",
                "object.base": "Settings must be an array of objects"
            })
        })
    }),

    UPDATE_CONFIGURATION: celebrate({
        body: Joi.object({
            id: objectId().required().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "any.required": "Id is required",
                "string.pattern.name": "Invalid id"
            }),
            attribute: Joi.number().integer().optional().messages({
                "number.base": "Attribute must be a number",
            }),
            settings: Joi.array().min(1).items(Joi.object().required()).optional().messages({
                "any.invalid": "Settings not be an empty array",
                "array.base": "Settings must be an array",
                "object.base": "Settings must be an array of objects"
            })
        })
    }),

    GET_CONFIGURATION: celebrate({
        query: Joi.object({
            id: objectId().optional().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "string.pattern.name": "Invalid id"
            }),
            page: Joi.number().integer().min(1).optional().messages({
                "number.base": "Page must be a number",
                "number.min": "Page must be greater than or equal to 1"
            }),
            limit: Joi.number().integer().optional().messages({
                "number.base": "Limit must be a number"
            }),
        }).options({ allowUnknown: true })
    }),

    DELETE_CONFIGURATION: celebrate({
        params: Joi.object({
            id: objectId().required().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "any.required": "Id is required",
                "string.pattern.name": "Invalid id"
            })
        })
    })
}

export { CONFIGURATION_SCHEMA };