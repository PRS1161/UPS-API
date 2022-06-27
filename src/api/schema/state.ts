import { celebrate, Joi } from 'celebrate';
import JoiObjectId from "joi-objectid";

const objectId = JoiObjectId(Joi);

const STATE_SCHEMA = {
    CREATE_STATE: celebrate({
        body: Joi.object({
            name: Joi.string().trim().required().messages({
                "string.empty": "Name is not allowed to be empty",
                "string.base": "Name must be a string",
                "any.required": "Name is required"
            }),
        })
    }),

    UPDATE_STATE: celebrate({
        body: Joi.object({
            id: objectId().required().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "any.required": "Id is required",
                "string.pattern.name": "Invalid id"
            }),
            name: Joi.string().trim().required().messages({
                "string.empty": "Name is not allowed to be empty",
                "string.base": "Name must be a string",
                "any.required": "Name is required"
            })
        })
    }),

    GET_STATE: celebrate({
        query: Joi.object({
            id: objectId().optional().messages({
                "string.empty": "Id not allowed to be empty",
                "alternatives.types": "Id must be a string",
                "string.pattern.name": "Invalid id"
            })
        }).options({ allowUnknown: true })
    }),

    DELETE_STATE: celebrate({
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

export { STATE_SCHEMA };