import * as l10n from 'jm-ez-l10n';
import { Container } from 'typedi';
import AdminModel from '../../common/models/Admin.model';
import StateModel from '../../common/models/State.model';
import CityModel from '../../common/models/City.model';
import status_code from '../../common/utils/StatusCodes';
import Logger from '../../common/loaders/logger';

export class ICity {
    static async addCity(data: any) {
        try {
            const token_data: any = Container.get('auth-token');
            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };
            const state = await StateModel.findOne({ _id: data.stateId });
            if (!state) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'State' }) };
            const city = await CityModel.findOne({ name: data.name });
            if (city) return { status: status_code.ALREADY_EXIST, message: l10n.t('ALREADY_EXISTS', { key: 'City' }) };

            await CityModel.create(data);
            return { status: status_code.OK, message: l10n.t('SUCCESS_CREATE', { key: 'City' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async updateCity(data: any) {
        try {
            const token_data: any = Container.get('auth-token');
            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };
            const city = await CityModel.findOne({ _id: data.id });
            if (city) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'City' }) };

            if (data.stateId) {
                const state = await StateModel.findOne({ _id: data.stateId });
                if (!state) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'State' }) };
            }

            await CityModel.updateOne({ _id: data.id }, data);
            return { status: status_code.OK, message: l10n.t('UPDATE_RESOURCE', { key: 'City' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async getCity(data: any) {
        try {
            const token_data: any = Container.get('auth-token');
            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };

            if (data.id) {
                const city = await CityModel.findOne({ _id: data.id });
                if (!city) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'City' }) };

                return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'City' }), data: city };
            } else {
                const limit = data.limit ? parseInt(data.limit) : 10;
                const page = data.page ? ((parseInt(data.page) - 1) * limit) : 0;
                const search = data.search;
                let condition: any = {};
                if (search) {
                    condition.name = { $regex: new RegExp(search, "i") };
                }

                const cities = await CityModel.aggregate([
                    {
                        $match: condition
                    },
                    {
                        $lookup: {
                            from: "state",
                            localField: "stateId",
                            foreignField: "_id",
                            as: "states",
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
                const count = await CityModel.countDocuments(condition);

                return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'City list', method: "get" }), count, data: cities };
            }

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async deleteCity(id: string) {
        try {
            const token_data: any = Container.get('auth-token');
            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };
            const city = await CityModel.findOne({ _id: id });
            if (!city) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'City' }) };

            await CityModel.deleteOne({ _id: id });
            return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'City', method: "remove" }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }
}