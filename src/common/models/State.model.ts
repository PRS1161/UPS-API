import { Schema, model } from 'mongoose';

export interface StateAttributes {
    name: string,
    createdAt?: Date,
    updatedAt?: Date
}

const StateSchema = new Schema<StateAttributes>(
    {
        name: {
            type: String,
            unique: true
        },
    },
    {
        collection: 'state',
        versionKey: false,
        timestamps: true
    }
);

const StateModel = model<StateAttributes>('state', StateSchema);

export default StateModel;