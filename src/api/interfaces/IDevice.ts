import * as l10n from 'jm-ez-l10n';
import DeviceModel from '../../common/models/Device.model';
import DeviceDataModel from '../../common/models/DeviceData.model';
import ConfigurationModel from '../../common/models/Configuration.model';
import status_code from '../../common/utils/StatusCodes';
import Logger from '../../common/loaders/logger';

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
                let device = await DeviceModel.findOne({ _id: data.id }, { deviceId: 1, name: 1, location: 1, configuration: 1, phase: 1, status: 1 }).populate('configuration', 'attribute').lean();
                if (!device) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Device' }) };

                const [deviceData] = await DeviceDataModel.find({ deviceId: device._id }).limit(1).sort({ createdAt: -1 });
                device.data = deviceData;
                device.configuration = device.configuration.attribute;

                return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'Device' }), data: device };
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
                    { $unwind: "$config" },
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
}