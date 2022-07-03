import * as l10n from 'jm-ez-l10n';
import CityModel from '../../common/models/City.model';
import LocationModel from '../../common/models/Location.model';
import status_code from '../../common/utils/StatusCodes';
import Logger from '../../common/loaders/logger';

export class ILocation {
    static async addLocation(data: any) {
        try {
            const city = await CityModel.findOne({ _id: data.cityId });
            if (!city) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'City' }) };
            const location = await LocationModel.findOne({ name: data.name });
            if (location) return { status: status_code.ALREADY_EXIST, message: l10n.t('ALREADY_EXISTS', { key: 'Location' }) };

            await LocationModel.create(data);
            return { status: status_code.OK, message: l10n.t('SUCCESS_CREATE', { key: 'Location' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async updateLocation(data: any) {
        try {
            const location = await LocationModel.findOne({ _id: data.id });
            if (location) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Location' }) };

            if (data.cityId) {
                const city = await CityModel.findOne({ _id: data.cityId });
                if (!city) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'City' }) };
            }

            await LocationModel.updateOne({ _id: data.id }, data);
            return { status: status_code.OK, message: l10n.t('UPDATE_RESOURCE', { key: 'Location' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async getLocation(data: any) {
        try {
            if (data.id) {
                const location = await LocationModel.findOne({ _id: data.id });
                if (!location) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Location' }) };

                return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'Locatin' }), data: location };
            } else {
                const limit = data.limit ? parseInt(data.limit) : 10;
                const page = data.page ? ((parseInt(data.page) - 1) * limit) : 0;
                const search = data.search;
                let condition: any = {};
                if (search) {
                    condition.name = { $regex: new RegExp(search, "i") };
                }

                const locations = await LocationModel.aggregate([
                    {
                        $match: condition
                    },
                    {
                        $lookup: {
                            from: "city",
                            localField: "cityId",
                            foreignField: "_id",
                            as: "cities",
                            pipeline: [{ $project: { name: 1 } }]
                        }
                    },
                    {
                        $skip: page
                    },
                    {
                        $limit: limit
                    },
                    {
                        $sort: { createdAt: -1 }
                    }
                ]);
                const count = await LocationModel.countDocuments(condition);

                return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Location list', method: "get" }), count, data: locations };
            }

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async deleteLocation(id: string) {
        try {
            const location = await LocationModel.findOne({ _id: id });
            if (!location) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Location' }) };

            await LocationModel.deleteOne({ _id: id });
            return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Location', method: "remove" }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }
}