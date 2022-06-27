import { celebrate, Joi } from 'celebrate';
import JoiObjectId from "joi-objectid";

const objectId = JoiObjectId(Joi);

const CITY_SCHEMA = {
    CREATE_CITY: celebrate({
        body: Joi.object({
            name: Joi.string().trim().required().messages({
                "string.empty": "Name is not allowed to be empty",
                "string.base": "Name must be a string",
                "any.required": "Name is required"
            }),
            stateId: objectId().required().messages({
                "string.empty": "State id not allowed to be empty",
                "alternatives.types": "State id must be a string",
                "any.required": "State id is required",
                "string.pattern.name": "Invalid state id"
            })
        })
    }),

    UPDATE_CITY: celebrate({
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
            stateId: objectId().optional().messages({
                "string.empty": "State id not allowed to be empty",
                "alternatives.types": "State id must be a string",
                "string.pattern.name": "Invalid state id"
            })
        })
    }),

    GET_CITY: celebrate({
        query: Joi.object({
            id: objectId().optional().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "string.pattern.name": "Invalid id"
            })
        }).options({ allowUnknown: true })
    }),

    DELETE_CITY: celebrate({
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

export { CITY_SCHEMA };