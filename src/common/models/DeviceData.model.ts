import { Schema, model } from 'mongoose';
import config from '../config';

export interface DeviceDataAttributes {
    deviceId: any,
    dateTime: string,
    outputVoltage: number,
    currnetLoad: number,
    frequency: number,
    mainVoltage: number,
    mainCurrent: number,
    batteryVoltage: number,
    currentBattery: number,
    dischargeBattery: number,
    restart: number
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
            get: (value) => {
                return Number(value * config.VOLTAGE_CONVERT).toFixed(2);
            },
            default: 0.0
        },
        currnetLoad: {
            type: Number,
            get: (value) => {
                return Number(value * config.PERCENTAGE_CONVERT).toFixed(2);
            },
            default: 0.0
        },
        frequency: {
            type: Number,
            get: (value) => {
                return Number(50);
            },
            default: 0.0
        },
        mainVoltage: {
            type: Number,
            get: (value) => {
                return Number(value * config.VOLTAGE_CONVERT).toFixed(2);
            },
            default: 0.0
        },
        mainCurrent: {
            type: Number,
            get: (value) => {
                return Number(value * config.VOLTAGE_CONVERT).toFixed(2);
            },
            default: 0.0
        },
        batteryVoltage: {
            type: Number,
            get: (value) => {
                return Number(value * config.PERCENTAGE_CONVERT).toFixed(2);
            },
            default: 0.0
        },
        currentBattery: {
            type: Number,
            get: (value) => {
                return Number(value * config.PERCENTAGE_CONVERT).toFixed(2);
            },
            default: 0.0
        },
        dischargeBattery: {
            type: Number,
            get: (value) => {
                return Number(value * config.PERCENTAGE_CONVERT).toFixed(2);
            },
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

const DeviceDataModel = model<DeviceDataAttributes>('data', DeviceDataSchema);

export default DeviceDataModel;