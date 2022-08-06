import { Schema, model } from 'mongoose';
import config from '../config';

export const getVoltage = (value: number) => {
    return value ? Number(value * config.VOLTAGE_CONVERT).toFixed(2) : 0.00;
};

export const getPercentage = (value: number) => {
    return value ? Number(value * config.PERCENTAGE_CONVERT).toFixed(2) : 0.00;
};

// export interface DeviceDataAttributes {
//     deviceId: any,
//     dateTime: string,
//     outputVoltage: Number,
//     currnetLoad: Number,
//     frequency: Number,
//     mainVoltage: Number,
//     mainCurrent: Number,
//     batteryVoltage: Number,
//     currentBattery: Number,
//     dischargeBattery: Number,
//     restart: Number
//     createdAt?: Date,
//     updatedAt?: Date
// }

const DeviceDataSchema = new Schema(
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
            get: getVoltage,
            default: 0.0
        },
        currnetLoad: {
            type: Number,
            get: getPercentage,
            default: 0.0
        },
        frequency: {
            type: Number,
            default: 50.0
        },
        mainVoltage: {
            type: Number,
            get: getVoltage,
            default: 0.0
        },
        mainCurrent: {
            type: Number,
            get: getVoltage,
            default: 0.0
        },
        batteryVoltage: {
            type: Number,
            get: getPercentage,
            default: 0.0
        },
        currentBattery: {
            type: Number,
            get: getPercentage,
            default: 0.0
        },
        dischargeBattery: {
            type: Number,
            get: getPercentage,
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
        toObject: {
            getters: true
        },
        toJSON: {
            getters: true
        },
    }
);

const DeviceDataModel = model('data', DeviceDataSchema);

export default DeviceDataModel;