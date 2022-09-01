import { Schema, model } from 'mongoose';

export const calculateValue = (value: number, multiplyBy: number) => {
    return value && multiplyBy ? Math.floor(value * multiplyBy) : 0;
};
export interface DeviceDataAttributes {
    deviceId: any,
    dateTime: string,
    outputVoltage: Number,
    currentLoad: Number,
    frequency: Number,
    mainVoltage: Number,
    mainCurrent: Number,
    batteryVoltage: Number,
    currentBattery: Number,
    dischargeBattery: Number,
    restart: Number
    createdAt?: Date,
    updatedAt?: Date
}

const DeviceDataSchema = new Schema<DeviceDataAttributes>(
    {
        deviceId: {
            type: Schema.Types.ObjectId,
            ref: "device"
        },
        dateTime: {
            type: String,
            default: ""
        },
        outputVoltage: {
            type: Number,
            default: 0.0
        },
        currentLoad: {
            type: Number,
            default: 0.0
        },
        frequency: {
            type: Number,
            default: 0.0
        },
        mainVoltage: {
            type: Number,
            default: 0.0
        },
        mainCurrent: {
            type: Number,
            default: 0.0
        },
        batteryVoltage: {
            type: Number,
            default: 0.0
        },
        currentBattery: {
            type: Number,
            default: 0.0
        },
        dischargeBattery: {
            type: Number,
            default: 0.0
        },
        restart: {
            type: Number,
            default: 0
        }
    },
    {
        collection: 'data',
        versionKey: false,
        timestamps: true,
    }
);

const DeviceDataModel = model<DeviceDataAttributes>('data', DeviceDataSchema);

export default DeviceDataModel;