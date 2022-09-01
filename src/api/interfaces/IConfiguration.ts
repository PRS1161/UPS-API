import * as l10n from 'jm-ez-l10n';
import ConfigurationModel from '../../common/models/Configuration.model';
import status_code from '../../common/utils/StatusCodes';
import Logger from '../../common/loaders/logger';

export class IConfiguration {
    static async addCounfiguration(data: any) {
        try {
            const config = await ConfigurationModel.findOne({ attribute: data.attribute });
            if (config) return { status: status_code.ALREADY_EXIST, message: l10n.t('ALREADY_EXISTS', { key: 'Configuration' }) };

            await ConfigurationModel.create(data);
            return { status: status_code.OK, message: l10n.t('SUCCESS_CREATE', { key: 'Configuration' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async updateConfiguration(data: any) {
        try {
            const { id, ...updateData } = data;

            await ConfigurationModel.updateOne({ _id: id }, updateData);
            return { status: status_code.OK, message: l10n.t('UPDATE_RESOURCE', { key: 'Configuration' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async getConfiguration(data: any) {
        try {
            if (data.pagination === 'false') {
                const configuration = await ConfigurationModel.find({ isDelete: false }, { attribute: 1 }).sort({ attribute: 1 });
                return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Configuration list', method: "get" }), data: configuration };
            }
            if (data.id) {
                const configuration = await ConfigurationModel.findOne({ _id: data.id });
                return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'Configuration' }), data: configuration };
            } else {
                let { limit, page, search } = data;
                let condition: any = { isDelete: false };
                limit = limit ? +limit : 10;
                page = page ? ((+page) - 1) * limit : 0;

                if (search) {
                    condition.$expr = {
                        "$regexMatch": {
                            "input": { "$toString": "$attribute" },
                            "regex": new RegExp(search, "i")
                        }
                    }
                }

                const configuration = await ConfigurationModel.find(condition).skip(page).limit(limit).sort({ createdAt: -1 });
                const count = await ConfigurationModel.countDocuments(condition);

                return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Configuration list', method: "get" }), count, data: configuration };
            }
        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async deleteConfiguration(id: string) {
        try {
            await ConfigurationModel.updateOne({ _id: id }, { isDelete: true });
            return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Configuration', method: "remove" }) };
        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }
}