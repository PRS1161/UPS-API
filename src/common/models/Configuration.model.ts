import { Schema, model } from 'mongoose';

export interface ConfigurationAttributes {
    attribute: number,
    settings: any,
    isDelete: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

const ConfigurationSchema = new Schema<ConfigurationAttributes>(
    {
        attribute: {
            type: Number
        },
        settings: {
            type: {}
        },
        isDelete: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'configuration',
        versionKey: false,
        timestamps: true
    }
);

const ConfigurationModel = model<ConfigurationAttributes>('configuration', ConfigurationSchema);

export default ConfigurationModel;