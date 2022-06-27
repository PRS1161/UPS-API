import * as l10n from 'jm-ez-l10n';
import { Container } from 'typedi';
import AdminModel from '../../common/models/Admin.model';
import StateModel from '../../common/models/State.model';
import status_code from '../../common/utils/StatusCodes';
import Logger from '../../common/loaders/logger';

export class IState {
    static async addState(data: any) {
        try {
            const token_data: any = Container.get('auth-token');
            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };
            const state = await StateModel.findOne({ name: data.name });
            if (state) return { status: status_code.ALREADY_EXIST, message: l10n.t('ALREADY_EXISTS', { key: 'State' }) };

            await StateModel.create(data);
            return { status: status_code.OK, message: l10n.t('SUCCESS_CREATE', { key: 'State' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async updateState(data: any) {
        try {
            const token_data: any = Container.get('auth-token');
            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };
            const state = await StateModel.findOne({ _id: data.id });
            if (!state) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'State' }) };

            await StateModel.updateOne({ _id: data.id }, { name: data.name });
            return { status: status_code.OK, message: l10n.t('UPDATE_RESOURCE', { key: 'State' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async getState(data: any) {
        try {
            const token_data: any = Container.get('auth-token');
            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };

            if (data.id) {
                const state = await StateModel.findOne({ _id: data.id });
                if (!state) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'State' }) };

                return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'State' }), data: state };
            } else {
                const limit = data.limit ? parseInt(data.limit) : 10;
                const page = data.page ? ((parseInt(data.page) - 1) * limit) : 0;
                const search = data.search;
                let condition: any = {};
                if (search) {
                    condition.name = { $regex: new RegExp(search, "i") };
                }

                const states = await StateModel.find(condition).skip(page).limit(limit).sort({ createdAt: -1 });
                const count = await StateModel.countDocuments(condition);

                return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'State list', method: "get" }), count, data: states };
            }

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async deleteState(id: string) {
        try {
            const token_data: any = Container.get('auth-token');
            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };
            const state = await StateModel.findOne({ _id: id });
            if (!state) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'State' }) };

            await StateModel.deleteOne({ _id: id });
            return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'State', method: "remove" }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }
}