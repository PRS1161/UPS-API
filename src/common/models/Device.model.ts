import { Schema, model } from 'mongoose';

export interface DeviceAttributes {
    deviceId: string,
    name: string,
    configuration: any,
    phase: number,
    location: string,
    data: any,
    status: number,
    createdAt?: Date,
    updatedAt?: Date
}

const DeviceSchema = new Schema<DeviceAttributes>(
    {
        deviceId: {
            type: String,
            unique: true
        },
        name: {
            type: String
        },
        configuration: {
            type: Schema.Types.ObjectId,
            ref: "configuration",
            default: null
        },
        phase: {
            type: Number,
            enum: [1, 3],
            default: 1
        },
        location: {
            type: String
        },
        status: {
            type: Number,
            enum: [0, 1], // 0 - Inactive, 1 - Active
            default: 1
        }
    },
    {
        collection: 'device',
        versionKey: false,
        timestamps: true
    }
);

const DeviceModel = model<DeviceAttributes>('device', DeviceSchema);

export default DeviceModel;