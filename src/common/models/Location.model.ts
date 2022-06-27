import { Schema, model } from 'mongoose';

export interface LocationAttributes {
    name: string,
    cityId: any,
    createdAt?: Date,
    updatedAt?: Date
}

const LocationSchema = new Schema<LocationAttributes>(
    {
        name: {
            type: String,
            unique: true
        },
        cityId: {
            type: Schema.Types.ObjectId,
            ref: "city"
        }
    },
    {
        collection: 'location',
        versionKey: false,
        timestamps: true
    }
);

const LocationModel = model<LocationAttributes>('location', LocationSchema);

export default LocationModel;