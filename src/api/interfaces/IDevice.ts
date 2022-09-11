import * as l10n from 'jm-ez-l10n';
import { Types } from 'mongoose';
import DeviceModel from '../../common/models/Device.model';
import DeviceDataModel, { calculateValue } from '../../common/models/DeviceData.model';
import ConfigurationModel from '../../common/models/Configuration.model';
import status_code from '../../common/utils/StatusCodes';
import Logger from '../../common/loaders/logger';
import config from '../../common/config';

export class IDevice {
    static async addDevice(data: any) {
        try {
            const deviceId = await DeviceModel.findOne({ deviceId: data.deviceId });
            if (deviceId) return { status: status_code.ALREADY_EXIST, message: l10n.t('ALREADY_EXISTS', { key: 'Device' }) };
            const configuration = await ConfigurationModel.findOne({ _id: data.configuration });
            if (!configuration) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Configuration' }) };
            await DeviceModel.create(data);
            return { status: status_code.OK, message: l10n.t('SUCCESS_CREATE', { key: 'Device' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async getDevice(data: any) {
        try {
            if (data.id) {
                if (data.info === 'true') {
                    let [device]: any = await DeviceModel.aggregate([
                        { $match: { _id: new Types.ObjectId(data.id) } },
                        {
                            $lookup: {
                                localField: 'configuration',
                                foreignField: '_id',
                                from: 'configuration',
                                as: 'config',
                                pipeline: [{ $project: { attribute: 1, _id: 1 } }]
                            }
                        },
                        {
                            $unwind: {
                                path: "$config",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $project: {
                                deviceId: 1,
                                name: 1,
                                configuration: "$config.attribute",
                                configurationId: "$config._id",
                                phase: 1,
                                location: 1,
                                status: 1,
                                createdAt: 1
                            }
                        }
                    ]);

                    if (!device) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Device' }) };

                    const { settings } = await ConfigurationModel.findOne({ _id: device.configurationId }, { settings: 1, _id: 0 });

                    let [deviceData]: any = await DeviceDataModel.find({ deviceId: device._id }).limit(1).sort({ createdAt: -1 });
                    if (deviceData) {
                        deviceData = deviceData.toJSON();
                        deviceData.outputVoltage = calculateValue(deviceData.outputVoltage, settings[0].key);
                        deviceData.currentLoad = calculateValue(deviceData.currentLoad, settings[1].key);
                        deviceData.mainVoltage = calculateValue(deviceData.mainVoltage, settings[2].key);
                        deviceData.frequency = deviceData.outputVoltage != 0 ? config.FREQUENCY : 0;
                        deviceData.batteryVoltage = calculateValue(deviceData.batteryVoltage, settings[4].key);
                        deviceData.currentBattery = calculateValue(deviceData.currentBattery, settings[5].key);
                        deviceData.dischargeBattery = calculateValue(deviceData.dischargeBattery, settings[6].key);

                        device.data = deviceData;
                    }

                    return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'Device' }), data: device };
                } else {
                    const device = await DeviceModel.findOne({ _id: data.id }, { deviceId: 1, name: 1, phase: 1, location: 1, configuration: 1 });
                    if (!device) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Device' }) };

                    return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'Device' }), data: device };
                }

            } else {
                const limit = data.limit ? parseInt(data.limit) : 10;
                const page = data.page ? ((parseInt(data.page) - 1) * limit) : 0;
                const search = data.search;
                let condition: any = {};

                if (search) {
                    condition.$or = [
                        { name: { $regex: new RegExp(search, "i") } },
                        { deviceId: { $regex: new RegExp(search, "i") } },
                        { location: { $regex: new RegExp(search, "i") } }
                    ];
                }

                const devices = await DeviceModel.aggregate([
                    { $match: condition },
                    {
                        $lookup: {
                            localField: 'configuration',
                            foreignField: '_id',
                            from: 'configuration',
                            as: 'config',
                            pipeline: [{ $project: { attribute: 1 } }]
                        }
                    },
                    {
                        $unwind: {
                            path: "$config",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            deviceId: 1,
                            name: 1,
                            configuration: "$config.attribute",
                            phase: 1,
                            location: 1,
                            status: 1,
                            createdAt: 1
                        }
                    },
                    { $skip: page },
                    { $limit: limit },
                    { $sort: { createdAt: -1 } }
                ]);

                const count = await DeviceModel.countDocuments(condition);

                return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Device list', method: "get" }), count, data: devices };
            }
        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async updateDevice(data: any) {
        try {
            const { id, ...updateData } = data;
            const configuration = await ConfigurationModel.findOne({ _id: data.configuration });
            if (!configuration) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Configuration' }) };

            await DeviceModel.updateOne({ _id: id }, updateData);
            return { status: status_code.OK, message: l10n.t('UPDATE_RESOURCE', { key: 'Device' }) };
        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async deleteDevice(id: string) {
        try {
            await DeviceModel.deleteOne({ _id: id });
            return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Device', method: "remove" }) };
        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }
}