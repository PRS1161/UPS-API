import { celebrate, Joi } from 'celebrate';
import JoiObjectId from "joi-objectid";

const objectId = JoiObjectId(Joi);

const DEVICE_SCHEMA = {
    CREATE_DEVICE: celebrate({
        body: Joi.object({
            deviceId: Joi.string().trim().required().messages({
                "string.empty": "Device id is not allowed to be empty",
                "string.base": "Device id must be a string",
                "any.required": "Device id is required"
            }),
            name: Joi.string().trim().required().messages({
                "string.empty": "Device Name is not allowed to be empty",
                "string.base": "Device Name must be a string",
                "any.required": "Device Name is required"
            }),
            location: Joi.string().trim().required().messages({
                "string.empty": "Location is not allowed to be empty",
                "string.base": "Location must be a string",
                "any.required": "Location is required"
            }),
            configuration: objectId().required().messages({
                "string.empty": "Configuration not allowed to be empty",
                "alternatives.types": "Configuration must be a string",
                "any.required": "Configuration is required",
                "string.pattern.name": "Invalid Configuration"
            }),
            phase: Joi.number().integer().required().messages({
                "number.base": "Phase must be a number",
                "number.empty": "Phase not allowed to be empty",
                "any.required": "Phase is required",
            }),
        })
    }),
    GET_DEVICE: celebrate({
        query: Joi.object({
            id: objectId().optional().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "string.pattern.name": "Invalid id"
            })
        }).options({ allowUnknown: true })
    }),

    UPDATE_DEVICE: celebrate({
        body: Joi.object({
            id: objectId().required().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "any.required": "Id is required",
                "string.pattern.name": "Invalid id"
            }),
            name: Joi.string().trim().required().messages({
                "string.empty": "Device Name is not allowed to be empty",
                "string.base": "Device Name must be a string",
                "any.required": "Device Name is required"
            }),
            location: Joi.string().trim().required().messages({
                "string.empty": "Location is not allowed to be empty",
                "string.base": "Location must be a string",
                "any.required": "Location is required"
            }),
            configuration: objectId().required().messages({
                "string.empty": "Configuration not allowed to be empty",
                "alternatives.types": "Configuration must be a string",
                "any.required": "Configuration is required",
                "string.pattern.name": "Invalid Configuration"
            }),
            phase: Joi.number().integer().required().messages({
                "number.base": "Phase must be a number",
                "number.empty": "Phase not allowed to be empty",
                "any.required": "Phase is required",
            }),
        })
    }),
};

export { DEVICE_SCHEMA };