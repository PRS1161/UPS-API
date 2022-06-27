import { Schema, model } from 'mongoose';

export interface CityAttributes {
    name: string,
    stateId: any,
    createdAt?: Date,
    updatedAt?: Date
}

const CitySchema = new Schema<CityAttributes>(
    {
        name: {
            type: String,
            unique: true
        },
        stateId: {
            type: Schema.Types.ObjectId,
            ref: "state"
        }
    },
    {
        collection: 'city',
        versionKey: false,
        timestamps: true
    }
);

const CityModel = model<CityAttributes>('city', CitySchema);

export default CityModel;