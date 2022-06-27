import { celebrate, Joi } from 'celebrate';
import JoiObjectId from "joi-objectid";

const objectId = JoiObjectId(Joi);

const LOCATION_SCHEMA = {
    CREATE_LOCATION: celebrate({
        body: Joi.object({
            name: Joi.string().trim().required().messages({
                "string.empty": "Name is not allowed to be empty",
                "string.base": "Name must be a string",
                "any.required": "Name is required"
            }),
            cityId: objectId().required().messages({
                "string.empty": "City id not allowed to be empty",
                "alternatives.types": "City id must be a string",
                "any.required": "City id is required",
                "string.pattern.name": "Invalid city id"
            })
        })
    }),

    UPDATE_LOCATION: celebrate({
        body: Joi.object({
            id: objectId().required().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "any.required": "Id is required",
                "string.pattern.name": "Invalid id"
            }),
            name: Joi.string().trim().optional().messages({
                "string.empty": "Name is not allowed to be empty",
                "string.base": "Name must be a string"
            }),
            cityId: objectId().optional().messages({
                "string.empty": "City id not allowed to be empty",
                "alternatives.types": "City id must be a string",
                "string.pattern.name": "Invalid city id"
            })
        })
    }),

    GET_LOCATION: celebrate({
        query: Joi.object({
            id: objectId().optional().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "string.pattern.name": "Invalid id"
            })
        }).options({ allowUnknown: true })
    }),

    DELETE_LOCATION: celebrate({
        query: Joi.object({
            id: objectId().required().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "any.required": "Id is required",
                "string.pattern.name": "Invalid id"
            })
        })
    })
}

export { LOCATION_SCHEMA };